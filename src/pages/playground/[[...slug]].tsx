import { darken, useTheme } from "@mui/material";
import type { GetServerSideProps, NextPage } from "next";
import React from "react";

import { ConfigContext } from "#/context";
import { MainAppBar } from "#/features/appBar/ui/MainAppBar";
import { CodePanel } from "#/features/codeRunner/ui/CodePanel";
import { OutputPanel } from "#/features/output/ui/OutputPanel";
import { PlaygroundViewProvider } from "#/features/playground/context/PlaygroundViewContext";
import { MobilePlayground } from "#/features/playground/ui/MobilePlayground";
import { ProjectPanel } from "#/features/project/ui/ProjectPanel";
import { TreeViewPanel } from "#/features/treeViewer/ui/TreeViewPanel";
import { createTranslationFunctions } from "#/i18n/createTranslationFunctions";
import { loadI18nServerProps, localeFromContext } from "#/i18n/getI18nProps";
import { db } from "#/server/db/client";
import { useAppConfig, useHasMounted } from "#/shared/hooks";
import { useMobileLayout } from "#/shared/hooks/useMobileLayout";
import {
  absoluteUrlFromPathname,
  pathnameFromResolvedUrl,
} from "#/shared/lib/seo";
import {
  resolveSsrDeviceType,
  setDeviceHintResponseHeaders,
} from "#/shared/lib/ssrDevice";
import { SiteSeoHead } from "#/shared/ui/seo/SiteSeoHead";
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

type PlaygroundPageProps = {
  ssrDeviceType: SsrDeviceType;
  canonicalUrl: string;
  pageTitle: string;
  pageDescription: string;
};

const PlaygroundPage: NextPage<PlaygroundPageProps> = ({
  canonicalUrl,
  pageTitle,
  pageDescription,
}) => {
  const theme = useTheme();
  const isMobile = useMobileLayout();

  const { data = {} } = useAppConfig();

  return (
    <ConfigContext.Provider value={data}>
      <SiteSeoHead
        title={pageTitle}
        description={pageDescription}
        canonicalUrl={canonicalUrl}
      />
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
> = async (context) => {
  const { req, res, params, resolvedUrl } = context;
  const ssrDeviceType = resolveSsrDeviceType(req.headers);
  setDeviceHintResponseHeaders(res);

  const slug = params?.slug;
  const slugStr = Array.isArray(slug) ? slug[0] : undefined;
  const pathOnly = pathnameFromResolvedUrl(resolvedUrl) || "/playground";
  const canonicalUrl = absoluteUrlFromPathname(pathOnly);

  const { i18n } = await loadI18nServerProps(context);
  const locale = localeFromContext(context);
  const translation = i18n.translations[locale];
  const LL = translation
    ? createTranslationFunctions(locale, translation)
    : undefined;

  let pageTitle = LL?.PLAYGROUND_SEO_TITLE() ?? "Playground | dStruct";
  let pageDescription =
    LL?.SITE_SEO_DESCRIPTION() ??
    "dStruct is a web app that helps you understand LeetCode problems. It allows you to visualize your solutions that you write in a built-in code editor.";

  if (slugStr) {
    const project = await db.playgroundProject.findUnique({
      where: { slug: slugStr },
      select: { title: true, description: true },
    });
    if (project) {
      pageTitle = `${project.title} | dStruct`;
      pageDescription = project.description?.trim()
        ? `${project.title}: ${project.description.trim()}`
        : (LL?.PLAYGROUND_PROJECT_SEO_DESCRIPTION({
            title: project.title,
          }) ??
          `Practice ${project.title} in dStruct — visualize solutions and run code in the browser.`);
    }
  }

  return {
    props: {
      ssrDeviceType,
      canonicalUrl,
      pageTitle,
      pageDescription,
      i18n,
    },
  };
};

export default PlaygroundPage;
