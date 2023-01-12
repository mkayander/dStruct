import type { NextPage } from 'next';
import type {
  AppContextType,
  AppPropsType,
  NextComponentType,
} from 'next/dist/shared/lib/utils';
import type { ReactElement, ReactNode } from 'react';
import type React from 'react';

export type GetLayout = (
  page: ReactElement,
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>,
  isLoading?: boolean
) => ReactNode;

export type NextPageWithLayout<
  TProps = Record<string, unknown>,
  TInitialProps = TProps
> = NextPage<TProps, TInitialProps> & {
  getLayout?: GetLayout;
};

type MyAppContextType = Omit<AppContextType, 'Component'> & {
  Component: NextPageWithLayout;
};

type MyAppPropsType = Omit<AppPropsType, 'Component'> & {
  Component: NextPageWithLayout;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type AppTypeWithLayout<P = {}> = NextComponentType<
  MyAppContextType,
  P,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  MyAppPropsType<any, P>
>;
