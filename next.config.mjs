/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const repo = "wasl-dam-web";

const nextConfig = {
  output: "export",
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
