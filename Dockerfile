FROM node:20-alpine
WORKDIR /app
COPY proxy.mjs .
ENTRYPOINT ["node", "proxy.mjs"]
