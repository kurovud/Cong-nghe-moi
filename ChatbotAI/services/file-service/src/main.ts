import { loadEnv, env, logger } from "@chatbot/common";
loadEnv();

import { createApp } from "./app";
import fs from "fs";
import path from "path";

async function main() {
  // Ensure uploads directory exists
  const uploadDir = env.UPLOAD_DIR || "./uploads";
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const app = createApp();
  const port = env.PORT || 4006;
  app.listen(port, () => {
    logger.info(`File Service running on port ${port}`);
  });
}

main().catch((err) => {
  logger.error("Failed to start File Service:", err);
  process.exit(1);
});