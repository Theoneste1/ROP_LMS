/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // External packages that should only be bundled server-side (Next.js 16 format)
  serverExternalPackages: ['@prisma/client'],
}

export default nextConfig
