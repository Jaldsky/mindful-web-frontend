FROM node:20-alpine
LABEL maintainer="ryzhenkovartg@gmail.com"
ENV TZ="Europe/Moscow"

RUN addgroup -g 1001 -S appgroup \
    && adduser -u 1001 -S appuser -G appgroup

WORKDIR /service/

COPY package.json /service/
RUN npm install

COPY web /service/web
RUN npm run build

RUN chown -R appuser:appgroup /service/

USER appuser
