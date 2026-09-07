import { DailyPageInteractive } from "#/features/homePage/ui/DailyPageInteractive";
import { getDailyInitialData } from "#/server/daily/getDailyInitialData";

import { ApolloHydrationProvider } from "#/app/locale-app/ApolloHydrationProvider";

/** Async server island: prefetch LeetCode daily data without blocking the page shell. */
export async function DailyApolloIsland() {
  const initialCache = await getDailyInitialData();

  return (
    <ApolloHydrationProvider initialCache={initialCache}>
      <DailyPageInteractive />
    </ApolloHydrationProvider>
  );
}
