import { Source } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import Image from "next/image";
import React from "react";

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
    <Tooltip title={site.title} arrow>
      <IconButton component="a" href={problemLink} target="_blank" size="small">
        {site.icon}
      </IconButton>
    </Tooltip>
  );
};
