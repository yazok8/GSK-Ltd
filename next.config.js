import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  output: 'standalone',
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

  // 1. Set correct headers for /robots.txt so it's served as text/plain
  async headers() {
    return [
      {
        source: '/robots.txt', 
        headers: [
          { key: 'Content-Type', value: 'text/plain; charset=UTF-8' },
        ],
      },
    ];
  },

  // 2. Rewrite the /robots.txt path to an API endpoint (or Next.js route)
  async rewrites() {
    return [
      // Keep your existing rewrite
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
      // Add a rewrite for /robots.txt
      {
        source: '/robots.txt',
        destination: '/api/robots', // or wherever you serve the text from
      },
    ];
  },

  // 3. Example webpack config
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
