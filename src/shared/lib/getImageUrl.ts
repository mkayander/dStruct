export const getImageUrl = (relativePath: string) =>
  `${process.env.NEXT_PUBLIC_BUCKET_BASE_URL}/${relativePath}`;
