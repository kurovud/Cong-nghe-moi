import { loadEnv, env, logger } from "@chatbot/common";
loadEnv();

import { createApp } from "./app";

async function main() {
  const app = createApp();
  const port = env.PORT || 4004;
  app.listen(port, () => {
    logger.info(`Review Service running on port ${port}`);
  });
}

main().catch((err) => {
  logger.error("Failed to start Review Service:", err);
  process.exit(1);
});