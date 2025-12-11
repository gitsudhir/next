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
  
  // Configure custom headers for proper MIME types
  async headers() {
    return [
      {
        source: '/linux/:path*.deb',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/vnd.debian.binary-package',
          },
        ],
      },
      {
        source: '/linux/install.sh',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/x-shellscript',
          },
        ],
      },
    ];
  },
};

export default nextConfig;