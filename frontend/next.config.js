/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  // FORCE Next.js to use THIS folder as root
  turbopack: {
    root: __dirname,
  },

  allowedDevOrigins: [
    "https://wk656j95-3000.inc1.devtunnels.ms",
    "http://localhost:3000",
    '4e28c73b5743.ngrok-free.app'
  ],

  // Proxy API requests to backend - this solves third-party cookie issues!
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/:path*`,
      },
      {
        source: '/auth/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/auth/:path*`,
      },
    ];
  },

  env: {
    API_URL: process.env.API_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
  }
}

module.exports = nextConfig;

