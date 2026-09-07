"use client";

import dynamic from "next/dynamic";
import React from "react";

const ProjectBrowser = dynamic(
  () =>
    import("#/features/project/ui/ProjectBrowser/ProjectBrowser").then(
      (module) => ({ default: module.ProjectBrowser }),
    ),
  { ssr: false },
);

/** Global project browser modal — loaded client-only so the page shell stays a Server Component. */
export const ProjectBrowserOverlay: React.FC = () => <ProjectBrowser />;
