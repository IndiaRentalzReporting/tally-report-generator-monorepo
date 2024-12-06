FROM node:18-alpine as base

FROM base as builder
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune @trg_app/auth-server --docker

FROM base as installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY --from=builder /app/out/json/ .
RUN npm install
COPY --from=builder /app/out/full/ .

RUN npm install -g turbo
RUN npm run build:production

FROM base as runner
WORKDIR /app
RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
USER expressjs
COPY --from=installer /app .

EXPOSE 4000

CMD node apps/auth-server/dist/src/index.js
