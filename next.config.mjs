/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/appointments/:path*",
        destination: "http://localhost:3001/api/appointments/:path*",
      },
      {
        source: "/api/cin/:path*",
        destination: "http://localhost:3001/api/cin/:path*",
      },
    ];
  },
};

export default nextConfig;
