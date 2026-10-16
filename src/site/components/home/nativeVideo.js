// Touch devices play the intro in the browser's own full-screen player instead of opening /intro/.
// Same behaviour as playNative in homepage/intro.js, which ships in a separate bundle.
export const INTRO_VIDEO = "https://github.com/context4ai/portal/releases/download/intro-video-2026-10-15/context4ai-intro.mp4"

export const nativePlayback = () => matchMedia("(hover: none) and (pointer: coarse)").matches

/** Must run inside the tap's handler. iPhone has no element full screen; a video without playsinline goes full screen when it plays. */
export function playNative(src) {
  const video = document.createElement("video")
  video.className = "native-video"
  video.src = src
  video.controls = true
  document.body.append(video)
  const change = () => { if (!document.fullscreenElement) done() }
  const done = () => { video.pause(); video.remove(); document.removeEventListener("fullscreenchange", change) }
  document.addEventListener("fullscreenchange", change)
  video.addEventListener("webkitendfullscreen", done)
  video.addEventListener("ended", () => { if (document.fullscreenElement) document.exitFullscreen() })
  if (video.requestFullscreen) video.requestFullscreen().then(() => screen.orientation?.lock?.("landscape").catch(() => {}), () => {})
  video.play().catch(() => {})
}
