type RuntimeConfig = {
    BUCKET_BASE_URL: typeof process.env.BUCKET_BASE_URL;
};

declare module 'next/config' {
    const getConfig: () => {
        publicRuntimeConfig: RuntimeConfig;
    };
    export default getConfig;
}
