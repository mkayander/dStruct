import { renderHook, waitFor } from "@testing-library/react";
import type { Session } from "next-auth";
import type { useSession } from "next-auth/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useProfileImageUploader } from "#/shared/hooks/useProfileImageUploader";

type SessionHook = ReturnType<typeof useSession>;

const mocks = vi.hoisted(() => ({
  axiosHead: vi.fn(),
  axiosGet: vi.fn(),
  axiosPost: vi.fn(),
  mutation: {
    mutateAsync: vi.fn(),
  },
}));

vi.mock("axios", () => ({
  default: {
    get: mocks.axiosGet,
    head: mocks.axiosHead,
    isAxiosError: (error: { response?: { status?: number } }) =>
      Boolean(error.response),
    post: mocks.axiosPost,
  },
}));

vi.mock("#/shared/api", () => ({
  api: {
    user: {
      setBucketImage: {
        useMutation: () => ({ mutateAsync: mocks.mutation.mutateAsync }),
      },
    },
  },
}));

const createSessionData = (bucketImage?: string): Session => ({
  expires: "2099-01-01T00:00:00.000Z",
  user: {
    bucketImage: bucketImage ?? null,
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    email: "user@example.com",
    emailVerified: null,
    id: "user-1",
    image: null,
    isAdmin: false,
    leetCodeUsername: null,
    name: "User",
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    usesLightMode: false,
  },
});

const createSessionHook = (bucketImage?: string): SessionHook => ({
  data: createSessionData(bucketImage),
  status: "authenticated",
  update: vi.fn(),
});

describe("useProfileImageUploader", () => {
  beforeEach(() => {
    mocks.axiosHead.mockReset();
    mocks.axiosGet.mockReset();
    mocks.axiosPost.mockReset();
    mocks.mutation.mutateAsync.mockReset();
  });

  it("checks a new bucket image after a previous bucket image 404s", async () => {
    mocks.axiosHead
      .mockRejectedValueOnce({ response: { status: 404 } })
      .mockResolvedValueOnce({ status: 200 });

    const { rerender } = renderHook(
      ({ session }) => useProfileImageUploader(session),
      { initialProps: { session: createSessionHook() } },
    );

    rerender({ session: createSessionHook("avatars/missing.png") });

    await waitFor(() => {
      expect(mocks.mutation.mutateAsync).toHaveBeenCalledWith({
        imageName: undefined,
      });
    });

    rerender({ session: createSessionHook("avatars/new.png") });

    await waitFor(() => {
      expect(mocks.axiosHead).toHaveBeenCalledWith(
        expect.stringContaining("avatars/new.png"),
      );
    });
  });

  it("does not rerun verification when only the mutation result identity changes", async () => {
    mocks.axiosHead.mockResolvedValue({ status: 200 });

    const session = createSessionHook("avatars/existing.png");
    const { rerender } = renderHook(
      ({ session: hookSession }) => useProfileImageUploader(hookSession),
      { initialProps: { session: createSessionHook() } },
    );

    rerender({ session });

    await waitFor(() => {
      expect(mocks.axiosHead).toHaveBeenCalledTimes(1);
    });

    rerender({ session });
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(mocks.axiosHead).toHaveBeenCalledTimes(1);
  });
});
