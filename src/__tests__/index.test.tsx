/**
 * @jest-environment jsdom
 */
import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import { Provider as ReduxProvider } from "react-redux";

import { StateThemeProvider } from "#/components/providers/StateThemeProvider";
import { QuestionOfTodayDocument } from "#/graphql/generated";
import en from "#/i18n/en/index";
import type { Translation } from "#/i18n/i18n-types";
import DashboardPage from "#/pages/index";
import { makeStore } from "#/store/makeStore";
import { withNextTRPC } from "#/utils/trpc-test-decorator";

const store = makeStore();

jest.mock("next/router", () => jest.requireActual("next-router-mock"));

jest.mock("next-auth/react", () => {
  const originalModule = jest.requireActual("next-auth/react");
  const mockSession = {
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
    user: { username: "admin" },
  };
  return {
    __esModule: true,
    ...originalModule,
    useSession: jest.fn(() => {
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
            <DashboardPage i18n={i18n} />
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
