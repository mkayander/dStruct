import { clientEnv as env } from '#/env/schema.mjs';

export const getImageUrl = (relativePath: string) => `${env.NEXT_PUBLIC_BUCKET_BASE_URL}${relativePath}`;
