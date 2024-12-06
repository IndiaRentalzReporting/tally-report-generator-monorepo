FROM node:18-alpine as base

FROM base as builder
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune @trg_app/auth-client --docker

FROM base as installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY /.env.production .
COPY --from=builder /app/out/json/ .
RUN npm install
COPY --from=builder /app/out/full/ .

RUN npm run build:production

FROM base as runner
WORKDIR /app
RUN addgroup --system --gid 1001 reactjs
RUN adduser --system --uid 1001 reactjs
COPY --from=installer app .

EXPOSE 3000

CMD ["npm", "run", "preview", "-w=apps/auth-client"]