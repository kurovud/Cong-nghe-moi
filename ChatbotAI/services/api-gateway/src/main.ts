import { loadEnv, env, logger } from "@chatbot/common";
loadEnv();

import { createApp } from "./app";

async function main() {
  const app = createApp();
  const port = env.PORT || 4000;
  app.listen(port, () => {
    logger.info(`API Gateway running on port ${port}`);
    logger.info(`Proxying to services:`);
    logger.info(`  Auth:         ${env.AUTH_SERVICE_URL}`);
    logger.info(`  Product:      ${env.PRODUCT_SERVICE_URL}`);
    logger.info(`  Order:        ${env.ORDER_SERVICE_URL}`);
    logger.info(`  Review:       ${env.REVIEW_SERVICE_URL}`);
    logger.info(`  Notification: ${env.NOTIFICATION_SERVICE_URL}`);
    logger.info(`  File:         ${env.FILE_SERVICE_URL}`);
    logger.info(`  Chat:         ${env.CHAT_SERVICE_URL}`);
  });
}

main().catch((err) => {
  logger.error("Failed to start API Gateway:", err);
  process.exit(1);
});