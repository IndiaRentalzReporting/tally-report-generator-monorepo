FROM node:18.18.2 as base

ARG APP_NAME

FROM base as builder
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune ${APP_NAME} --docker

FROM base as installer
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder app/out/json .
COPY --from=builder app/out/package-lock.json ./package-lock.json
RUN npm install

COPY --from=builder app/out/full .
COPY turbo.json turbo.json
RUN npm install -g turbo
RUN turbo run build --filter=${APP_NAME}...

FROM base as runner
WORKDIR /app
RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
USER expressjs
COPY --from=installer /app .

EXPOSE 4000

CMD node apps/server/dist/src/index.js
