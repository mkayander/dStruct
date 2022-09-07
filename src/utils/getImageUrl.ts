import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

export const getImageUrl = (relativePath: string) => `${publicRuntimeConfig.BUCKET_BASE_URL}${relativePath}`;
