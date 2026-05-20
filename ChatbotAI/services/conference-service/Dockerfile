FROM node:20-bullseye-slim
WORKDIR /app

RUN apt-get update && \
	apt-get install -y --no-install-recommends openssl ca-certificates && \
	rm -rf /var/lib/apt/lists/*

COPY common/ ./common/
WORKDIR /app/common
RUN npm install && npm run build

WORKDIR /app/services/conference-service
COPY services/conference-service/package*.json ./
RUN npm install
COPY services/conference-service/ ./
RUN npx prisma generate
RUN npm run build

EXPOSE 4003
CMD ["node", "dist/main.js"]