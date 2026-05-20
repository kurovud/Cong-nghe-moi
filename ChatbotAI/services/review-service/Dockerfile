FROM node:20-bullseye-slim
WORKDIR /app

RUN apt-get update && \
	apt-get install -y --no-install-recommends openssl ca-certificates && \
	rm -rf /var/lib/apt/lists/*

COPY common/ ./common/
WORKDIR /app/common
RUN npm install && npm run build

WORKDIR /app/services/review-service
COPY services/review-service/package*.json ./
RUN npm install
COPY services/review-service/ ./
RUN npx prisma generate
RUN npm run build

EXPOSE 4004
CMD ["node", "dist/main.js"]