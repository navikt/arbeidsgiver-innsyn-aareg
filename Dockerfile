FROM node:alpine as builder

FROM navikt/node-express:12.2.0
WORKDIR /app
RUN yarn add http-proxy-middleware@0.21.0 fs-extra mustache-express jsdom promise

COPY build/ build/
COPY src/server/ src/server/
COPY start.sh ./

EXPOSE 3000
ENTRYPOINT ["/bin/sh", "start.sh"]