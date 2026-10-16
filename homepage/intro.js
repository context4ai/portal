// /intro/ is the homepage document with the copy faded out and the video over the field.
// From the homepage it is a history entry of the same document; the docs site links to it as a page.

/** Set by the docs site before it opens /intro/; Back then returns there instead of to the homepage copy. */
export const RETURN_KEY = "context-intro-return";
const FADE = 450;
const IDLE = 1000;

/** Touch devices play the video in the system player instead of /intro/. */
export const nativePlayback = () => matchMedia("(hover: none) and (pointer: coarse)").matches;

/**
 * Plays `src` full screen in the browser's own player and removes it on exit. Must run inside the tap's handler.
 * iPhone has no element full screen; a video without playsinline goes full screen when it starts playing.
 */
export function playNative(src) {
  const video = document.createElement("video");
  video.className = "native-video";
  video.src = src;
  video.controls = true;
  document.body.append(video);
  const done = () => { video.pause(); video.remove(); document.removeEventListener("fullscreenchange", change); };
  const change = () => { if (!document.fullscreenElement) done(); };
  document.addEventListener("fullscreenchange", change);
  video.addEventListener("webkitendfullscreen", done);
  video.addEventListener("ended", () => { if (document.fullscreenElement) document.exitFullscreen(); });
  if (video.requestFullscreen) video.requestFullscreen().then(() => screen.orientation?.lock?.("landscape").catch(() => {}), () => {});
  video.play().catch(() => {});
}

export function intro(root, reduced) {
  const el = document.querySelector("[data-intro]");
  if (!el) return;
  const video = el.querySelector("[data-intro-video]");
  const toggle = el.querySelector("[data-intro-toggle]");
  const track = el.querySelector("[data-intro-track]");
  const fill = el.querySelector("[data-intro-fill]");
  const buffer = el.querySelector("[data-intro-buffer]");
  const time = el.querySelector("[data-intro-time]");
  const labels = JSON.parse(el.dataset.labels);
  const text = () => labels[root.lang === "zh-CN" ? "zh" : "en"];
  const isIntro = () => /^\/intro\/?$/.test(location.pathname);
  const clock = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const session = (key, value) => { try { return value === undefined ? sessionStorage.getItem(key) : value === null ? sessionStorage.removeItem(key) : sessionStorage.setItem(key, value); } catch { return null; } };

  function play() {
    if (!video.src) video.src = el.dataset.src;
    video.play().catch(sync);
  }
  function show(push) {
    if (push) history.pushState({ intro: true }, "", "/intro/");
    root.classList.add("intro-on");
    el.classList.remove("is-done");
    wake();
    setTimeout(play, reduced ? 0 : FADE);
  }
  function hide() {
    video.pause();
    root.classList.remove("intro-on", "intro-arrive");
    setTimeout(() => el.classList.remove("is-done"), reduced ? 0 : FADE);
  }
  function back() {
    const target = session(RETURN_KEY);
    if (target) {
      session(RETURN_KEY, null);
      video.pause();
      // Both documents opt in to a cross-document view transition, so the docs page fades in where supported.
      const style = document.createElement("style");
      style.textContent = "@view-transition { navigation: auto; }";
      document.head.append(style);
      root.classList.add("intro-leave");
      setTimeout(() => location.assign(target), reduced ? 0 : FADE);
    } else if (history.state?.intro) history.back();
    else { history.replaceState(null, "", "/"); hide(); }
  }

  function sync() {
    const playing = !video.paused && !video.ended;
    el.classList.toggle("is-playing", playing);
    const label = playing ? text().pause : text().play;
    toggle.setAttribute("aria-label", label); toggle.title = label;
    track.setAttribute("aria-label", text().seek);
    if (!playing) wake();
  }
  function progress() {
    const d = video.duration || 0, t = video.currentTime || 0;
    fill.style.width = d ? `${t / d * 100}%` : "0";
    const end = video.buffered.length ? video.buffered.end(video.buffered.length - 1) : 0;
    buffer.style.width = d ? `${end / d * 100}%` : "0";
    time.textContent = d ? `${clock(t)} / ${clock(d)}` : clock(t);
    track.setAttribute("aria-valuemax", String(Math.round(d)));
    track.setAttribute("aria-valuenow", String(Math.round(t)));
    track.setAttribute("aria-valuetext", time.textContent);
  }
  function seek(to) {
    if (!video.duration) return;
    video.currentTime = Math.max(0, Math.min(video.duration, to));
    if (video.currentTime < video.duration) el.classList.remove("is-done");
    progress();
  }

  // The controls hide once the pointer rests, unless it rests on them or is dragging the progress bar.
  let idle = 0;
  function wake() {
    el.classList.add("is-awake");
    clearTimeout(idle);
    idle = setTimeout(() => {
      if (el.querySelector(".intro-bar:hover, .intro-close:hover") || track.matches(".is-dragging")) wake();
      else el.classList.remove("is-awake");
    }, IDLE);
  }

  for (const event of ["play", "pause", "ended"]) video.addEventListener(event, sync);
  for (const event of ["timeupdate", "progress", "loadedmetadata", "durationchange"]) video.addEventListener(event, progress);
  video.addEventListener("ended", () => el.classList.add("is-done"));
  video.addEventListener("click", () => (video.paused ? play() : video.pause()));
  toggle.addEventListener("click", () => (video.paused ? play() : video.pause()));
  el.querySelector("[data-intro-replay]").addEventListener("click", () => { el.classList.remove("is-done"); seek(0); play(); });
  el.querySelectorAll("[data-intro-back]").forEach(a => a.addEventListener("click", e => { e.preventDefault(); back(); }));
  el.addEventListener("pointermove", wake);

  const at = e => { const r = track.getBoundingClientRect(); return (e.clientX - r.left) / r.width * video.duration; };
  track.addEventListener("pointerdown", e => { track.setPointerCapture(e.pointerId); track.classList.add("is-dragging"); seek(at(e)); });
  track.addEventListener("pointermove", e => { if (track.hasPointerCapture(e.pointerId)) seek(at(e)); });
  track.addEventListener("lostpointercapture", () => track.classList.remove("is-dragging"));
  track.addEventListener("keydown", e => {
    const step = { ArrowLeft: -5, ArrowRight: 5, Home: -Infinity, End: Infinity }[e.key];
    if (step === undefined) return;
    e.preventDefault(); seek(video.currentTime + step); wake();
  });
  addEventListener("keydown", e => {
    if (!root.classList.contains("intro-on") || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === "Escape") back();
    else if ((e.key === " " || e.key === "k") && !e.target.closest("button,a,[role=slider]")) { e.preventDefault(); video.paused ? play() : video.pause(); }
    else return;
    wake();
  });

  document.querySelector("[data-intro-open]")?.addEventListener("click", e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    e.preventDefault();
    if (nativePlayback()) return playNative(el.dataset.src);
    session(RETURN_KEY, null);
    show(true);
  });
  addEventListener("popstate", () => (isIntro() ? show(false) : hide()));
  // A page restored from the back-forward cache keeps the faded-out state it left in.
  addEventListener("pageshow", e => { if (e.persisted) root.classList.remove("intro-leave"); });

  sync();
  if (isIntro()) {
    el.addEventListener("animationend", () => root.classList.remove("intro-arrive"), { once: true });
    play();
  }
}
