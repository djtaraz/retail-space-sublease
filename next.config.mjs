/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rssm-listings.s3.eu-west-2.amazonaws.com",
        port: "",
        pathname: "/*",
      },
    ],
  },
};

export default nextConfig;
