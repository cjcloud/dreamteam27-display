/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static export for Firebase hosting
  images: {
    unoptimized: true,
  },
  // OneDrive's cloud-sync breaks Next's native file watcher and can hang
  // `next dev` at startup. Polling-based watching avoids that.
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules', '**/.next', '**/.git'],
      };
    }
    return config;
  },
}

module.exports = nextConfig
