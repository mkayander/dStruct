import { ImageResponse } from "@vercel/og";
import Image from "next/image";

export const config = {
  runtime: "experimental-edge",
};

export default function OGResponse() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image src="/static/screen2" alt="Web App Screenshot" />
      </div>
    ),
    {
      width: 1200,
      height: 600,
    }
  );
}
