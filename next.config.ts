import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["pdfjs-dist", "@google/generative-ai", "@pinecone-database/pinecone"],
  },
};

export default nextConfig;
