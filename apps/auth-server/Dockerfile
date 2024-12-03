FROM node:18.18.2 as base

ARG APP_NAME

FROM base as builder
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune ${APP_NAME} --docker

FROM base as installer
WORKDIR /app

# First install dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN yarn install

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .

FROM base as runner
WORKDIR /app

RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
USER expressjs
COPY --from=installer /app .

EXPOSE 4000

CMD node apps/server/dist/src/index.js
