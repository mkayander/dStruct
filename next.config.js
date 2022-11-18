const { createEnvObject } = require('@top-tools/easyenv');

const env = createEnvObject();

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    publicRuntimeConfig: {
        BUCKET_BASE_URL: env.BUCKET_BASE_URL,
    },
    images: {
        domains: [new URL(env.BUCKET_BASE_URL).hostname],
    },
};

module.exports = nextConfig;
