/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Add webpack configuration to fix MongoDB native dependency issues
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client-side: exclude all MongoDB and native dependencies
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // MongoDB core
        mongodb: false,
        'mongodb-client-encryption': false,
        '@mongodb-js/zstd': false,
        
        // Snappy compression (all platform variants)
        'snappy': false,
        '@napi-rs/snappy-wasm32-wasi': false,
        '@napi-rs/snappy-linux-x64-gnu': false,
        '@napi-rs/snappy-darwin-arm64': false,
        '@napi-rs/snappy-win32-x64-msvc': false,
        '@napi-rs/snappy-linux-arm64-gnu': false,
        '@napi-rs/snappy-darwin-x64': false,
        
        // AWS dependencies
        'aws4': false,
        '@aws-sdk/credential-providers': false,
        '@aws-sdk/client-sso-oidc': false,
        
        // Other MongoDB optional dependencies
        'kerberos': false,
        'bson-ext': false,
        'saslprep': false,
        
        // Node.js built-ins that can't run in browser
        'dns': false,
        'fs': false,
        'net': false,
        'tls': false,
        'crypto': false,
        'stream': false,
        'path': false,
        'os': false,
      }
    }
    
    // Server-side: mark as external (don't bundle)
    config.externals = config.externals || []
    config.externals.push({
      'mongodb': 'mongodb',
      'mongodb-client-encryption': 'mongodb-client-encryption',
      'aws4': 'aws4',
      'snappy': 'snappy',
      'kerberos': 'kerberos',
      'bson-ext': 'bson-ext',
      'saslprep': 'saslprep',
      '@mongodb-js/zstd': '@mongodb-js/zstd',
    })
    
    return config
  },
  
  // Alternative approach: Use serverExternalPackages
  serverExternalPackages: [
    'mongodb',
    'mongoose',
    '@mongodb-js/zstd',
    'snappy',
    'kerberos',
    'mongodb-client-encryption',
  ],
}

export default nextConfig
