/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        API_GATEWAY_URL: process.env.API_GATEWAY_URL || 'http://localhost:4000',
    },
    // Proxy API requests in development
    async rewrites() {
        return [
            // When USE_BACKEND=true, proxy /api/* to the gateway (except chat which stays local for Gemini)
            ...(process.env.USE_BACKEND === 'true' ? [
                { source: '/backend/:path*', destination: `${process.env.API_GATEWAY_URL || 'http://localhost:4000'}/api/:path*` },
            ] : []),
        ];
    },
};

module.exports = nextConfig;