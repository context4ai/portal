FROM oven/bun:1.3.9 AS bun

FROM node:22-bookworm-slim AS build
COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun
WORKDIR /portal
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM nginx:1.29-alpine
ENV SOURCEGRAPH_UPSTREAM=http://context4ai-sourcegraph.flycast \
    NGINX_RESOLVER=[fdaa::3]
COPY deploy/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /portal/dist/home/ /usr/share/nginx/html/
COPY --from=build /portal/dist/context-site/ /usr/share/nginx/html/context/
EXPOSE 8080
