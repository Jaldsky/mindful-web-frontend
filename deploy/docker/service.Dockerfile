FROM mwf-web-build:latest AS build

FROM nginxinc/nginx-unprivileged:alpine
LABEL maintainer="ryzhenkovartg@gmail.com"
ENV TZ="Europe/Moscow"

COPY deploy/config/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /service/web/dist /usr/share/nginx/html

USER nginx
EXPOSE 8080
