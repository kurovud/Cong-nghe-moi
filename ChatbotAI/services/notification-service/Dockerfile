FROM node:20-bullseye-slim
WORKDIR /app

COPY common/ ./common/
WORKDIR /app/common
RUN npm install && npm run build

WORKDIR /app/services/notification-service
COPY services/notification-service/package*.json ./
RUN npm install
COPY services/notification-service/ ./
RUN npm run build

EXPOSE 4005
CMD ["node", "dist/main.js"]