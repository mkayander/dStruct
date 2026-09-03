import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { apolloClient } from "#/graphql/apolloClient";
import type {
  GetUserProfileQueryResult,
  GetUserProfileQueryVariables,
} from "#/graphql/generated";
import { GetUserProfileDocument } from "#/graphql/generated";
import { db } from "#/server/db/client";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || !("username" in body)) {
    return NextResponse.json(
      { error: "username not provided" },
      { status: 400 },
    );
  }

  const username = (body as { username: unknown }).username;
  if (typeof username !== "string" || !username.trim()) {
    return NextResponse.json(
      { error: "username not provided" },
      { status: 400 },
    );
  }

  const leetCodeUser = await db.leetCodeUser.findFirstOrThrow({
    where: {
      user: {
        name: username,
      },
    },
  });

  if (!leetCodeUser.token) {
    return NextResponse.json(
      { error: "leetcode session token not configured" },
      { status: 400 },
    );
  }

  const cookieStore = await cookies();
  cookieStore.set("LEETCODE_SESSION", leetCodeUser.token);

  const response = await apolloClient.query<
    GetUserProfileQueryResult,
    GetUserProfileQueryVariables
  >({
    query: GetUserProfileDocument,
    variables: {
      username,
    },
  });

  const status = response.errors ? 400 : 200;
  return NextResponse.json(response, { status });
}
