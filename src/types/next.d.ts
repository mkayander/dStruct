type RuntimeConfig = {
  BUCKET_BASE_URL: typeof process.env.BUCKET_BASE_URL;
};

declare module "next/config" {
  const getConfig: () => {
    publicRuntimeConfig: RuntimeConfig;
  };
  export default getConfig;
}

declare module "*.txt" {
  const content: string;
  export default content;
}

/**
 * If set to false, reads from the controlled structure will not be recorded.
 * This is useful when you want to read from the data structure without
 * triggering a blink animation for some or whole part of the code.
 */
var recordReads: boolean | undefined; // eslint-disable-line no-var
