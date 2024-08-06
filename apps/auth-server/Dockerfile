FROM node:18.18.2 as base

FROM base as builder
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune @fullstack_app/server --docker

FROM base as installer
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder app/out/json .
COPY --from=builder app/out/package-lock.json ./package-lock.json
RUN npm install

COPY --from=builder app/out/full .
COPY turbo.json turbo.json
RUN npm install -g turbo
RUN turbo run build --filter=@fullstack_app/server...

FROM base as runner
WORKDIR /app
RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
USER expressjs
COPY --from=installer /app .

ENV PORT=4000
ENV SESSION_SECRET=wubalubadubdub
ENV NODE_ENV=development
ENV MONGO_USERNAME=himanshu
ENV MONGO_PASSWORD=Himkap@1705
ENV MONGO_DB_NAME=test_template

EXPOSE 4000

CMD node apps/server/dist/src/index.js
