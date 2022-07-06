# syntax=docker/dockerfile:1.0.0-experimental

FROM node:16.15.1 AS deps
WORKDIR /app
RUN wget -O /bin/jq https://github.com/stedolan/jq/releases/download/jq-1.6/jq-linux64 && chmod +x /bin/jq
COPY . .
RUN npm -g config set user root && npm -g config set unsafe-perm true
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm install

FROM docker:20.10.17-dind AS test
RUN apk update && apk add \
  bash \
  git \
  jq \
  nodejs \
  npm
WORKDIR /app
COPY --from=deps /app .
# Update loki config for dind
# See: https://github.com/oblador/loki/issues/9#issuecomment-803197847
RUN rm ./loki.config.js && mv ./loki.config-ci.js ./loki.config.js

# Rebuild the source code only when needed
FROM node:16.15.1 AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Production image, copy all the files and run next
FROM node:16.15.1 AS production
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

COPY docker-entrypoint.sh /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["node_modules/.bin/serve", "dist", "-p", "3000", "-s"]
