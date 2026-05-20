import { createProxyMiddleware, Options } from "http-proxy-middleware";
import { logger } from "@chatbot/common";
import { isAllowedOrigin } from "../config/cors";

export function createServiceProxy(target: string, pathRewrite?: Record<string, string>) {
  const options: Options = {
    target,
    changeOrigin: true,
    pathRewrite,
    on: {
      proxyRes: (proxyRes, req) => {
        const originHeader = req.headers.origin;
        const origin = typeof originHeader === "string" ? originHeader : undefined;

        // Upstream services currently set permissive CORS headers. Normalize them here
        // so browser requests with credentials are accepted only for allowed origins.
        delete proxyRes.headers["access-control-allow-origin"];
        delete proxyRes.headers["access-control-allow-credentials"];
        delete proxyRes.headers["access-control-allow-methods"];
        delete proxyRes.headers["access-control-allow-headers"];

        if (isAllowedOrigin(origin)) {
          if (origin) {
            proxyRes.headers["access-control-allow-origin"] = origin;
            proxyRes.headers["vary"] = "Origin";
          }
          proxyRes.headers["access-control-allow-credentials"] = "true";
        }
      },
      error: (err, _req, res) => {
        logger.error(`Proxy error to ${target}:`, err.message);
        (res as any).status?.(502).json({
          success: false,
          error: { code: "SERVICE_UNAVAILABLE", message: "Service tạm thời không khả dụng" },
        });
      },
    },
  };
  return createProxyMiddleware(options);
}