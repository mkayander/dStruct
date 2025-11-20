import CloudDone from "@mui/icons-material/CloudDone";
import CloudQueue from "@mui/icons-material/CloudQueue";
import CloudSync from "@mui/icons-material/CloudSync";
import SdCardAlert from "@mui/icons-material/SdCardAlert";
import { Tooltip } from "@mui/material";
import React from "react";

import { useI18nContext } from "#/shared/hooks";

export enum EditorState {
  INITIAL,
  PENDING_CHANGES,
  SAVED_ON_SERVER,
  FORKED_UNAUTHENTICATED,
  FORKED_UNOWNED,
}

type EditorStateIconProps = {
  state: EditorState;
  isLoading?: boolean;
};

export const EditorStateIcon: React.FC<EditorStateIconProps> = ({
  state,
  isLoading,
}) => {
  const { LL } = useI18nContext();
  let icon: React.ReactElement;
  let text: string;

  if (isLoading) {
    icon = <CloudSync />;
    text = `${LL.SYNCING_WITH_SERVER()}...`;
  } else {
    switch (state) {
      default:
      case EditorState.SAVED_ON_SERVER:
        icon = <CloudDone />;
        text = `${LL.SAVED_IN_THE_CLOUD()} ✅`;
        break;

      case EditorState.PENDING_CHANGES:
        icon = <CloudQueue />;
        text = `${LL.PENDING_CHANGES()}...`;
        break;

      case EditorState.FORKED_UNAUTHENTICATED:
        icon = <SdCardAlert color="warning" />;
        text = `${LL.YOU_NEED_TO_BE_AUTHED_TO_SAVE_CODE()}! \n${LL.YOUR_CHANGES_WILL_BE_LOST()}! 😱`;
        break;

      case EditorState.FORKED_UNOWNED:
        icon = <SdCardAlert color="warning" />;
        text = `${LL.YOU_DONT_OWN_THIS_PROJECT()}! \n${LL.YOUR_CHANGES_WILL_BE_LOST()}! 😱`;
    }
  }

  return (
    <Tooltip
      title={text.split("\n").map((str) => (
        <div key={str}>{str}</div>
      ))}
      arrow
      placement="left"
    >
      {icon}
    </Tooltip>
  );
};
