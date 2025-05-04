import { Source } from "@mui/icons-material";
import Image from "next/image";
import React from "react";

import { Button } from "#/shadcn/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "#/shadcn/ui/tooltip";

const ICON_SIZE = 24;

type SiteData = {
  title: string;
  icon: React.ReactNode;
};

const getSiteFromUrl = (url: string): SiteData => {
  const data = new URL(url);
  const name = data.hostname.split(".").at(-2);

  const result: SiteData = {
    title: "",
    icon: null,
  };

  switch (name) {
    case "leetcode":
      result.title = "Open this problem on LeetCode";
      result.icon = (
        <Image
          src="/LeetCode_logo_rvs.png"
          alt="LeetCode Logo"
          height={ICON_SIZE}
          width={ICON_SIZE}
          style={{ marginTop: "1px" }}
        />
      );
      break;

    default:
      result.title = `Open this problem on ${name}`;
      result.icon = <Source fontSize="small" />;
  }

  return result;
};

type ProblemLinkButtonProps = {
  problemLink: string;
};

export const ProblemLinkButton: React.FC<ProblemLinkButtonProps> = ({
  problemLink,
}) => {
  const site = getSiteFromUrl(problemLink);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <a href={problemLink} target="_blank" rel="noopener noreferrer">
              {site.icon}
            </a>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{site.title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
