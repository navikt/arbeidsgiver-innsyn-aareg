
FROM navikt/node-express:1.0.0
WORKDIR /app

COPY build/ build/
COPY src/server/ src/server/
COPY start.sh ./



EXPOSE 3000
ENTRYPOINT ["/bin/sh", "start.sh"]