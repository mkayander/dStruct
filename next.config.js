/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    publicRuntimeConfig: {
        BUCKET_BASE_URL: process.env.BUCKET_BASE_URL,
    },
    images: {
        domains: [new URL(process.env.BUCKET_BASE_URL).hostname],
    },
};

module.exports = nextConfig;
