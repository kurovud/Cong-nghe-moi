FROM node:20-bullseye-slim
WORKDIR /app

RUN apt-get update && \
	apt-get install -y --no-install-recommends openssl ca-certificates && \
	rm -rf /var/lib/apt/lists/*

COPY common/ ./common/
WORKDIR /app/common
RUN npm install && npm run build

WORKDIR /app/services/auth-service
COPY services/auth-service/package*.json ./
RUN npm install
COPY services/auth-service/ ./
RUN npx prisma generate
RUN npm run build

EXPOSE 4001
CMD ["node", "dist/main.js"]