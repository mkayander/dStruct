# Prisma Field Encryption

Config-driven, transparent field-level encryption for Prisma. Follows SOLID and is designed to be extracted as a standalone library.

## Structure

- **`cipher.ts`** – Pure encryption (AES-256-GCM). No Prisma dependency.
- **`types.ts`** – Interfaces (`EncryptedField`, `FieldEncryptionConfig`, `Encryptor`).
- **`extension.ts`** – Prisma extension factory. Depends only on `@prisma/client/extension`.

## Usage

```ts
import { createFieldEncryptionExtension } from "#/server/db/encryption";

const db = prisma.$extends(
  createFieldEncryptionExtension({
    key: process.env.ENCRYPTION_KEY!,
    fields: [
      { model: "LeetCodeUser", field: "token" },
      { model: "User", field: "ssn" },
    ],
  }),
);
```

## Extracting as a Library

1. Copy `cipher.ts`, `types.ts`, `extension.ts`, and `index.ts`.
2. Add peer dependency: `@prisma/client`.
3. Publish. Consumers install Prisma themselves.

```json
{
  "peerDependencies": {
    "@prisma/client": ">=5.0.0"
  }
}
```

## Testing

Inject a mock cipher:

```ts
createFieldEncryptionExtension({
  key: "unused",
  fields: [{ model: "User", field: "ssn" }],
  cipher: {
    encrypt: (s) => `encrypted:${s}`,
    tryDecrypt: (s) => (s.startsWith("encrypted:") ? s.slice(10) : s),
  },
});
```
