import axios, { AxiosError, type AxiosResponse } from "axios";
import { parse, serialize } from "cookie";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return proxyGraphqlRequest(request);
}

export async function POST(request: Request) {
  return proxyGraphqlRequest(request);
}

async function proxyGraphqlRequest(request: Request) {
  let response: AxiosResponse | undefined;

  const cookieHeader = request.headers.get("cookie");
  const token = cookieHeader ? parse(cookieHeader).LEETCODE_SESSION : undefined;

  let body: unknown;
  if (request.method !== "GET" && request.method !== "HEAD") {
    body = await request.json();
  }

  try {
    response = await axios({
      method: request.method,
      url: "https://leetcode.com/graphql/",
      headers: {
        cookie: (token && serialize("LEETCODE_SESSION", token)) || "",
      },
      data: body,
    });
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      response = error.response;
    }
  }

  if (!response) {
    return NextResponse.json(
      { message: "Failed to get a response" },
      { status: 500 },
    );
  }

  return NextResponse.json(response.data, { status: response.status });
}
