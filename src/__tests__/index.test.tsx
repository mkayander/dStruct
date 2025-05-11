import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import { Provider as ReduxProvider } from "react-redux";
import { vi } from "vitest";

import { QuestionOfTodayDocument } from "#/graphql/generated";
import en from "#/i18n/en/index";
import type { Translation } from "#/i18n/i18n-types";
import DashboardPage from "#/pages/index";
import { TooltipProvider } from "#/shadcn/ui/tooltip";
import { withNextTRPC } from "#/shared/lib/trpc-test-decorator";
import { StateThemeProvider } from "#/shared/ui/providers/StateThemeProvider";
import { makeStore } from "#/store/makeStore";

const store = makeStore();

vi.mock("next/router", () => vi.importActual("next-router-mock"));

vi.mock("next-auth/react", () => {
  const originalModule = vi.importActual("next-auth/react");
  const mockSession = {
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
    user: { username: "admin" },
  };
  return {
    __esModule: true,
    ...originalModule,
    useSession: vi.fn(() => {
      return { data: mockSession, status: "authenticated" }; // return type is [] in v3 but changed to {} in v4
    }),
  };
});

const mocks = [
  {
    request: {
      query: QuestionOfTodayDocument,
    },
    result: {
      data: {
        questionOfToday: {
          id: "1",
          title: "test",
          slug: "test",
          difficulty: "EASY",
        },
      },
    },
  },
];

const i18n = {
  locale: "en",
  dictionary: en as Translation,
} as const;

describe("DashboardPage", () => {
  it("renders a CTA button", () => {
    render(
      <ReduxProvider store={store}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <StateThemeProvider>
            <TooltipProvider>
              <DashboardPage i18n={i18n} />
            </TooltipProvider>
          </StateThemeProvider>
        </MockedProvider>
      </ReduxProvider>,
      { wrapper: withNextTRPC },
    );

    const ctaButton = screen.getByTestId("cta-to-playground");

    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveAttribute("href", "/playground");
  });
});
