import { loadEnv, env, logger } from "@chatbot/common";
loadEnv();

import { createApp } from "./app";

async function main() {
  const app = createApp();
  const port = env.PORT || 4002;
  app.listen(port, () => {
    logger.info(`Product Service running on port ${port}`);
  });
}

main().catch((err) => {
  logger.error("Failed to start Product Service:", err);
  process.exit(1);
});