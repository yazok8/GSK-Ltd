import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: true,  // Fix: 'serverAction' to 'serverActions'
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gsk-ltd.s3.us-east-2.amazonaws.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
  },
  // Move rewrites inside the config object properly
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
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
      };
    }
    return config;
  },
};

export default nextConfig;