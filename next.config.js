// next.config.js
import path from "path";
import { fileURLToPath } from "url";

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname:'gsk-ltd.s3.us-east-2.amazonaws.com',
        port: '',
        pathname: '/**',
      }
    ], // Replace with your actual bucket domain
  },
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
  },
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      config.watchOptions = {
        ignored: [
          path.resolve(__dirname, "node_modules"),
          path.resolve(__dirname, "dist"),
          path.resolve(__dirname, ".next"),
          "**/*.log",
          "**/temp/**",
        ],
        // Optional: Adjust polling if necessary
        // poll: 1000, // Check for changes every second
      };
    }
    return config;
  },
};

export default nextConfig;

//["gsk-ltd.s3.us-east-2.amazonaws.com"]