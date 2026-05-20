FROM node:20-bullseye-slim
WORKDIR /app

# Copy and build common library
COPY common/ ./common/
WORKDIR /app/common
RUN npm install && npm run build

# Install and build service (replicating monorepo structure)
WORKDIR /app/services/api-gateway
COPY services/api-gateway/package*.json ./
RUN npm install
COPY services/api-gateway/ ./
RUN npm run build

EXPOSE 4000
CMD ["node", "dist/main.js"]