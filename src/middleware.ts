import { getAll } from "@vercel/edge-config";
import { NextResponse } from "next/server";

export const config = { matcher: "/api/config" };

export async function middleware() {
  const config = await getAll();

  return NextResponse.json(config ?? {});
}
