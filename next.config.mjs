/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "media.example.com",
      },
      {
        protocol: "https",
        hostname: "3a65eb39ad373f08e94df357a504b981.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "pub-c71ef7045fff4c60aeb28ca64b9a6508.r2.dev",
      },
    ],
  },
};

export default nextConfig;
