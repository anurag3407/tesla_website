import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/developer',
        destination: '/developers',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
