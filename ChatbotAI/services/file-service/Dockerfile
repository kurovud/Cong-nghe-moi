FROM node:20-bullseye-slim
WORKDIR /app

COPY common/ ./common/
WORKDIR /app/common
RUN npm install && npm run build

WORKDIR /app/services/file-service
COPY services/file-service/package*.json ./
RUN npm install
COPY services/file-service/ ./
RUN npm run build
RUN mkdir -p uploads

EXPOSE 4006
CMD ["node", "dist/main.js"]