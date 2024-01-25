const isProd = process.env.NODE_ENV === 'production'
const prefixPath = isProd ? '/tei-viewer' : ''

/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        prefixPath,
    },
    output: 'export',
    assetPrefix: prefixPath,
    basePath: prefixPath,
    reactStrictMode: true,
};

export default nextConfig;
