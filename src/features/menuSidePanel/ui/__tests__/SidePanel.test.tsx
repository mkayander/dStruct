import { ThemeProvider } from "@mui/material/styles";
import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type * as SharedHooks from "#/shared/hooks";
import { mockUseI18nContext } from "#/shared/testUtils";
import { theme } from "#/themes";

import { SidePanel } from "../SidePanel";

vi.mock("next-auth/react", () => ({
  signOut: vi.fn(),
  useSession: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  usePathname: vi.fn(() => "/playground"),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

vi.mock("#/shared/hooks", async (importOriginal) => {
  const actual = await importOriginal<typeof SharedHooks>();
  return {
    ...actual,
    useI18nContext: mockUseI18nContext,
  };
});

const renderSidePanel = () =>
  render(
    <ThemeProvider theme={theme}>
      <SidePanel isOpen setIsOpen={vi.fn()} />
    </ThemeProvider>,
  );

describe("SidePanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render a profile link when the session has no user id", () => {
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: "unauthenticated",
      update: vi.fn(),
    } as ReturnType<typeof useSession>);

    renderSidePanel();

    expect(
      screen.queryByRole("link", { name: "PROFILE" }),
    ).not.toBeInTheDocument();
  });

  it("links profile to the authenticated user id", () => {
    vi.mocked(useSession).mockReturnValue({
      data: {
        user: {
          id: "user-abc",
          name: "Test User",
          email: "test@example.com",
        },
      },
      status: "authenticated",
      update: vi.fn(),
    } as ReturnType<typeof useSession>);

    renderSidePanel();

    expect(screen.getByRole("link", { name: "PROFILE" })).toHaveAttribute(
      "href",
      "/profile/user-abc",
    );
  });
});
