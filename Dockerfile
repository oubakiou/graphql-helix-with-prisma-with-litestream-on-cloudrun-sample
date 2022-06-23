# for Cloud Run
FROM node:18-slim AS builder
RUN apt-get update && \
  apt-get install -y --no-install-recommends libsqlite3-dev && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*
ADD https://github.com/benbjohnson/litestream/releases/download/v0.3.8/litestream-v0.3.8-linux-amd64-static.tar.gz /tmp/litestream.tar.gz
RUN tar -C /usr/local/bin -xzf /tmp/litestream.tar.gz
COPY . .
RUN npm ci
RUN npm run build

FROM node:18-slim
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
COPY --from=builder index.js index.js
COPY --from=builder node_modules/.prisma/client/libquery_engine-* node_modules/.prisma/client/
COPY --from=builder node_modules/.prisma/client/schema.prisma node_modules/.prisma/client/schema.prisma
COPY --from=builder /usr/local/bin/litestream /usr/local/bin/litestream
#COPY --from=builder /local.db /prod.db
RUN apt-get update && \
  apt-get install -y --no-install-recommends libsqlite3-dev ca-certificates && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

COPY etc/litestream.yml /etc/litestream.yml
COPY run.sh /run.sh

CMD ["/bin/bash", "run.sh"]
