import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import { Provider as ReduxProvider } from "react-redux";
import { vi } from "vitest";

import { LANDING_PRIMARY_PLAYGROUND_HREF } from "#/features/homePage/lib/landingPlaygroundDemos";
import { MarketingHomeView } from "#/features/homePage/ui/MarketingHomeView";
import { mockUseSearchParam } from "#/features/project/ui/ProjectBrowser/__tests__/testUtils";
import { ProjectBrowserProvider } from "#/features/project/ui/ProjectBrowser/ProjectBrowserContext";
import { QuestionOfTodayDocument } from "#/graphql/generated";
import en from "#/i18n/en/index";
import type { Translation } from "#/i18n/i18n-types";
import { withNextTRPC } from "#/shared/lib/trpc-test-decorator";
import { I18nProvider } from "#/shared/ui/providers/I18nProvider";
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
      return { data: mockSession, status: "authenticated" };
    }),
  };
});

vi.mock("#/shared/hooks", async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import("#/shared/hooks")>();
  return {
    ...actual,
    useSearchParam: (param: string) => mockUseSearchParam(param),
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
  translations: { en: en as Translation },
} as const;

describe("MarketingHomeView", () => {
  it("renders a CTA button", () => {
    render(
      <ReduxProvider store={store}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <StateThemeProvider>
            <I18nProvider i18n={i18n}>
              <ProjectBrowserProvider>
                <MarketingHomeView />
              </ProjectBrowserProvider>
            </I18nProvider>
          </StateThemeProvider>
        </MockedProvider>
      </ReduxProvider>,
      { wrapper: withNextTRPC },
    );

    const ctaButton = screen.getByTestId("cta-to-playground");

    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveAttribute("href", LANDING_PRIMARY_PLAYGROUND_HREF);
  });
});
