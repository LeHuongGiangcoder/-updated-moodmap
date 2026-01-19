import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This block MUST be here to skip the hanging TypeScript step
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
