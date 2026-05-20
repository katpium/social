import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
      allowedOrigins: [
        "*.trycloudflare.com",
        "*.ngrok-free.app",
        "*.ngrok.app",
        "*.ngrok.io",
        "*.loca.lt",
      ],
    },
  },
};

export default nextConfig;
