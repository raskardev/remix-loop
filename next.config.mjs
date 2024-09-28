/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.pullandbear.net",
      },
    ],
  },
};

export default nextConfig;
