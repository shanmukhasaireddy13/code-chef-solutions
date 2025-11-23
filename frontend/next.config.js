/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  // FORCE Next.js to use THIS folder as root
  turbopack: {
    root: __dirname,
  },

  allowedDevOrigins: [
    "https://wk656j95-3000.inc1.devtunnels.ms",
    "http://localhost:3000"
  ],
};

module.exports = {
  reactCompiler: true,
  env: {
    API_URL: process.env.API_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
  }
};

