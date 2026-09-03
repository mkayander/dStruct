import S3 from "aws-sdk/clients/s3";
import { NextResponse } from "next/server";

import { env } from "#/env/server.mjs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const file = url.searchParams.get("file");
  const fileType = url.searchParams.get("fileType");

  if (!file || !fileType) {
    return NextResponse.json(
      { message: "file and fileType query params are required" },
      { status: 400 },
    );
  }

  const s3 = new S3({
    apiVersion: "2006-03-01",
    accessKeyId: env.ACCESS_KEY,
    secretAccessKey: env.SECRET_KEY,
    region: "eu-central-1",
  });

  const post = await s3.createPresignedPost({
    Bucket: env.BUCKET_NAME,
    Fields: {
      key: file,
      "Content-Type": fileType,
    },
    Expires: 60,
    Conditions: [["content-length-range", 0, 1048576]],
  });

  return NextResponse.json(post);
}
