# dStruct - LeetCode Problem Visualization Web App

#### [dstruct.app](https://dstruct.app/)

<p align="center">
  <a href="https://dstruct.app">
    <img src="https://therealsujitk-vercel-badge.vercel.app/?app=dstruct&style=for-the-badge" alt="Deployed on Vercel" />
  </a>
  <a href="/LICENSE">
    <img src="https://img.shields.io/badge/license-AGPL-blue?style=for-the-badge" alt="AGPL-3.0 License" />
  </a>
</p>

## Overview

dStruct is a web app designed to assist users in understanding and visualizing LeetCode problems. It provides a built-in
code editor where users can write and visualize their solutions.

<p align="center">
  <a href="https://dstruct.app/playground">
    <img src="https://i.imgur.com/Q1FRwaK.png" alt="dStruct Web App" />
  </a>
</p>

## Features

- **Integrated Code Editor**: Write and visualize LeetCode solutions within the app using the built-in code editor
  powered by Monaco Editor.
- **Graphical Visualization**: Gain insights into data structures and algorithms through graphical representations,
  making it easier to understand and debug code.
- **Authentication with NextAuth**: Secure user authentication with NextAuth for a personalized experience.
- **Prisma ORM for Database Operations**: Utilizes Prisma ORM for efficient database operations, enhancing data handling
  and storage capabilities.
- **GraphQL Integration**: Incorporates GraphQL for efficient query execution and improved API interactions.
- **State Management with Redux Toolkit**: Manages application state seamlessly with the help of Redux Toolkit for
  predictable state changes.
- **Internationalization (i18n) Support**: Implements Typesafe i18n for easy translation and localization.
- **Interactive UI with Material-UI and Emotion**: Enhances user interface with the help of Material-UI components and
  Emotion for styling.
- **Code Quality and Testing**: Maintains code quality through linting with ESLint, Prettier, and testing with Jest.

## Tech Stack

- **Frontend**:

  - React
  - Next.js
  - Redux Toolkit
  - Material-UI
  - Emotion
  - Monaco Editor
  - Apollo Client

- **Backend**:

  - Node.js
  - Express
  - Prisma
  - GraphQL
  - NextAuth

- **Database**:

  - Prisma ORM
  - SQLite (or your preferred database)

- **Other Tools**:
  - Typesafe i18n
  - Axios
  - Husky (Git Hooks)
  - Semantic Release
  - Jest Testing Framework

## 3D Visualization

This project has a "blender" folder which contains the 3D models used for visualization. The 3D models are created using
Blender and exported as .glb files.
To convert a `.glb` file to a React component, use the `gltffsx` package, for example:

```bash
pnpm exec gltfjsx blender/logotype/binary_tree.glb -o src/3d-models/BinaryTree.tsx -TtD
```

## Getting Started

1. Clone the repository:

```
git clone https://github.com/mkayander/dStruct.git
```

2. Install dependencies using pnpm:

```
pnpm install
```

3. Run the development server:

```
pnpm run dev
```

Visit http://localhost:3000 to access the application.

## Environment Variables

Create a .env file in the root directory based on the .env.example file. Fill in the necessary values for the following
variables:

```
NODE_ENV=development

# Prisma
# DEV
DATABASE_URL='mysql://your_dev_database_url'
DIRECT_DATABASE_URL='mysql://your_dev_direct_database_url'

# PROD
#DATABASE_URL='mysql://your_prod_database_url'
# DIRECT_DATABASE_URL='mysql://your_prod_direct_database_url'

PRISMA_FIELD_ENCRYPTION_KEY=k1.aesgcm256.your_encryption_key

# Next Auth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# AWS
ACCESS_KEY=your_aws_access_key
SECRET_KEY=your_aws_secret_key
BUCKET_NAME=your_s3_bucket_name
NEXT_PUBLIC_BUCKET_BASE_URL=your_s3_bucket_base_url

# Verifiable Credentials (VC) REST API
KV_REST_API_READ_ONLY_TOKEN=your_kv_rest_api_read_only_token
KV_REST_API_TOKEN=your_kv_rest_api_token
KV_REST_API_URL=your_kv_rest_api_url
KV_URL=your_kv_url
```

When adding additional env variables, update the schema in /env/schema.mjs accordingly.

## Scripts

- pnpm build: Build the Next.js application.
- pnpm start: Start the production server.
- pnpm test: Run Jest tests.
- pnpm lint: Lint the code using ESLint.
- pnpm prisma:generate: Generate Prisma client.
- pnpm generate-graphql: Generate GraphQL types.

## Contribution Guidelines

Contributions to the project are welcome. Please follow the guidelines outlined in the CONTRIBUTING.md file.

## License

This project is licensed under the MIT License.
