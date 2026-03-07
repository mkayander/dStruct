import { darken, useTheme } from "@mui/material";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import React from "react";

import { ConfigContext } from "#/context";
import { MainAppBar } from "#/features/appBar/ui/MainAppBar";
import { CodePanel } from "#/features/codeRunner/ui/CodePanel";
import { OutputPanel } from "#/features/output/ui/OutputPanel";
import { PlaygroundViewProvider } from "#/features/playground/context/PlaygroundViewContext";
import { MobilePlayground } from "#/features/playground/ui/MobilePlayground";
import { ProjectPanel } from "#/features/project/ui/ProjectPanel";
import { TreeViewPanel } from "#/features/treeViewer/ui/TreeViewPanel";
import { db } from "#/server/db/client";
import { useAppConfig, useHasMounted } from "#/shared/hooks";
import { useMobileLayout } from "#/shared/hooks/useMobileLayout";
import {
  resolveSsrDeviceType,
  setDeviceHintResponseHeaders,
} from "#/shared/lib/ssrDevice";
import { PageScrollContainer } from "#/shared/ui/templates/PageScrollContainer";
import type { SplitPanelsLayoutProps } from "#/shared/ui/templates/SplitPanelsLayout/SplitPanelsLayout";
import { SplitPanelsLayout } from "#/shared/ui/templates/SplitPanelsLayout/SplitPanelsLayout";
import { SplitPanelsLayoutSkeleton } from "#/shared/ui/templates/SplitPanelsLayout/SplitPanelsLayoutSkeleton";
import type { SsrDeviceType } from "#/themes";

type DesktopWrapperProps = SplitPanelsLayoutProps;

const DesktopWrapper: React.FC<DesktopWrapperProps> = ({
  TopLeft,
  BottomLeft,
  TopRight,
  BottomRight,
}) => {
  const hasMounted = useHasMounted();

  // Defer split layout until after mount to avoid Emotion hydration mismatch
  // (server and client can render the four panels in different order).
  if (!hasMounted) return <SplitPanelsLayoutSkeleton />;

  return (
    <SplitPanelsLayout
      component="main"
      TopLeft={TopLeft}
      BottomLeft={BottomLeft}
      TopRight={TopRight}
      BottomRight={BottomRight}
    />
  );
};

const BASE_URL = "https://dstruct.pro";

type PlaygroundPageProps = {
  ssrDeviceType: SsrDeviceType;
  canonicalUrl: string;
  pageTitle: string;
};

const PlaygroundPage: NextPage<PlaygroundPageProps> = ({
  canonicalUrl,
  pageTitle,
}) => {
  const theme = useTheme();
  const isMobile = useMobileLayout();

  const { data = {} } = useAppConfig();

  return (
    <ConfigContext.Provider value={data}>
      <Head>
        <title>{pageTitle}</title>
        <link rel="canonical" href={canonicalUrl} />
      </Head>
      <PageScrollContainer
        isPage={true}
        options={
          isMobile
            ? { overflow: { x: "hidden", y: "hidden" } }
            : { scrollbars: { autoHide: "scroll" }, overflow: { x: "hidden" } }
        }
        style={{
          height: "100vh",
          background: darken(theme.palette.background.default, 0.1),
        }}
      >
        {isMobile ? (
          <PlaygroundViewProvider>
            <MainAppBar toolbarVariant="dense" />
            <MobilePlayground />
          </PlaygroundViewProvider>
        ) : (
          <>
            <MainAppBar toolbarVariant="dense" />
            <DesktopWrapper
              TopLeft={ProjectPanel}
              BottomLeft={CodePanel}
              TopRight={TreeViewPanel}
              BottomRight={OutputPanel}
            />
          </>
        )}
      </PageScrollContainer>
    </ConfigContext.Provider>
  );
};

export const getServerSideProps: GetServerSideProps<
  PlaygroundPageProps
> = async ({ req, res, params }) => {
  const ssrDeviceType = resolveSsrDeviceType(req.headers);
  setDeviceHintResponseHeaders(res);

  const slug = params?.slug;
  const slugStr = Array.isArray(slug) ? slug[0] : undefined;
  const canonicalUrl = slugStr
    ? `${BASE_URL}/playground/${slugStr}`
    : `${BASE_URL}/playground`;

  let pageTitle = "Playground | dStruct";
  if (slugStr) {
    const project = await db.playgroundProject.findUnique({
      where: { slug: slugStr },
      select: { title: true },
    });
    pageTitle = project ? `${project.title} | dStruct` : "Playground | dStruct";
  }

  return {
    props: {
      ssrDeviceType,
      canonicalUrl,
      pageTitle,
    },
  };
};

export default PlaygroundPage;
