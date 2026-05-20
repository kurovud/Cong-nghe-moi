import { loadEnv, env, logger } from "@chatbot/common";
loadEnv();

import { createApp } from "./app";

async function main() {
  const app = createApp();
  const port = env.PORT || 4003;
  app.listen(port, () => {
    logger.info(`Order Service running on port ${port}`);
  });
}

main().catch((err) => {
  logger.error("Failed to start Order Service:", err);
  process.exit(1);
});