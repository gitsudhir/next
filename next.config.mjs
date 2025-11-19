/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable strict mode for better error reporting
  reactStrictMode: true,
  
  // Configure trailing slash behavior
  trailingSlash: false,
  
  // Configure asset prefix if needed for custom domains
  assetPrefix: '',
  
  // Ensure proper handling of static assets
  poweredByHeader: false,
  
  // Configure output for standalone deployment if needed
  output: 'standalone',
};

export default nextConfig;
