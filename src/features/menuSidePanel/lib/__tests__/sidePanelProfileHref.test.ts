import type { Session } from "next-auth";
import { describe, expect, it } from "vitest";

import { sidePanelProfileHref } from "../sidePanelProfileHref";

describe("sidePanelProfileHref", () => {
  it("returns null when session is missing", () => {
    expect(sidePanelProfileHref(null)).toBeNull();
    expect(sidePanelProfileHref(undefined)).toBeNull();
  });

  it("returns null when user id is missing", () => {
    expect(
      sidePanelProfileHref({
        expires: "2099-01-01T00:00:00.000Z",
        user: { id: "" } as Session["user"],
      }),
    ).toBeNull();
  });

  it("returns profile path for a user id", () => {
    expect(
      sidePanelProfileHref({
        expires: "2099-01-01T00:00:00.000Z",
        user: { id: "user-abc" } as Session["user"],
      }),
    ).toBe("/profile/user-abc");
  });
});
