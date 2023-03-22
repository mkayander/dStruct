import {
  CloudDone,
  CloudQueue,
  CloudSync,
  SdCardAlert,
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import React from "react";

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
  let icon: React.ReactElement;
  let text: string;

  if (isLoading) {
    icon = <CloudSync />;
    text = "Syncing with server...";
  } else {
    switch (state) {
      default:
      case EditorState.SAVED_ON_SERVER:
        icon = <CloudDone />;
        text = "Saved in the cloud ✅";
        break;

      case EditorState.PENDING_CHANGES:
        icon = <CloudQueue />;
        text = "Pending changes...";
        break;

      case EditorState.FORKED_UNAUTHENTICATED:
        icon = <SdCardAlert color="warning" />;
        text =
          "You need to be authed to save code! \nYour changes will be lost! 😱";
        break;

      case EditorState.FORKED_UNOWNED:
        icon = <SdCardAlert color="warning" />;
        text = "You don't own this project! \nYour changes will be lost! 😱";
    }
  }

  return (
    <Tooltip
      title={text.split("\n").map((str) => (
        <div key={str}>{str}</div>
      ))}
      arrow
    >
      {icon}
    </Tooltip>
  );
};
