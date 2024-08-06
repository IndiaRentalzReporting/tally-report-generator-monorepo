FROM node:18.18.2 as base

FROM base as builder
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune @fullstack_app/client --docker

FROM base as installer
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder app/out/json .
COPY --from=builder app/out/package-lock.json ./package-lock.json
RUN npm install

COPY --from=builder app/out/full .
COPY turbo.json turbo.json
RUN npm install -g turbo
RUN turbo run build --filter=@fullstack_app/client...

FROM base as runner
WORKDIR /app
RUN addgroup --system --gid 1001 reactjs
RUN adduser --system --uid 1001 reactjs
COPY --from=installer app .

EXPOSE 3000

CMD ["npm", "run", "preview", "--w=apps/client"]