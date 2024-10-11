/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [],
  },
  eslint: {
    ignoreDuringBuilds: true
  }
}

export default config