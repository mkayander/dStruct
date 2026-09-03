import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useProfileUserId } from "#/shared/hooks/useProfileUserId";

vi.mock("next/navigation", () => ({
  useParams: () => ({ userId: "app-user-id" }),
}));

describe("useProfileUserId", () => {
  it("reads userId from App params", () => {
    const { result } = renderHook(() => useProfileUserId());

    expect(result.current).toBe("app-user-id");
  });
});
