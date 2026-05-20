FROM node:20-bullseye-slim
WORKDIR /app

COPY common/ ./common/
WORKDIR /app/common
RUN npm install && npm run build

WORKDIR /app/services/scheduler-service
COPY services/scheduler-service/package*.json ./
RUN npm install
COPY services/scheduler-service/ ./
RUN npm run build

EXPOSE 4007
CMD ["node", "dist/main.js"]