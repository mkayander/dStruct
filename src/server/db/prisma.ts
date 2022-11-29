import { PrismaClient } from '@prisma/client';
import { fieldEncryptionMiddleware } from 'prisma-field-encryption';

import { env } from '#/env/server.mjs';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// This is a function, don't forget to call it:
prisma.$use(fieldEncryptionMiddleware());

if (env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export { prisma };
