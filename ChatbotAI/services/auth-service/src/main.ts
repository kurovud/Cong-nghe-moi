import { loadEnv, env, logger } from "@chatbot/common";
loadEnv();

import { createApp } from "./app";

async function main() {
  const app = createApp();
  const port = env.PORT || 4001;
  app.listen(port, () => {
    logger.info(`Auth Service running on port ${port}`);
  });
}

main().catch((err) => {
  logger.error("Failed to start Auth Service:", err);
  process.exit(1);
});