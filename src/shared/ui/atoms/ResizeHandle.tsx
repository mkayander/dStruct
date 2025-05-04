import React from "react";
import { PanelResizeHandle } from "react-resizable-panels";

import { cn } from "#/shared/lib/utils";

type ResizeHandleProps = {
  id?: string;
};

export const ResizeHandle: React.FC<ResizeHandleProps> = ({ id }) => {
  return (
    <PanelResizeHandle
      className={cn(
        "relative flex-[0_0_12px] bg-transparent outline-none",
        "[&:hover_.ResizeHandleInner]:bg-primary/30",
        "[&[data-resize-handle-active]_.ResizeHandleInner]:bg-[#7986cb]",
      )}
      id={id}
    >
      <div className="ResizeHandleInner absolute inset-[2px] rounded-[6px] bg-transparent transition-colors duration-200">
        <svg
          className="icon absolute top-[calc(50%-11px)] left-[calc(50%-11px)] h-[1em] w-[1em] text-[11px] text-transparent transition-colors duration-200"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M8,18H11V15H2V13H22V15H13V18H16L12,22L8,18M12,2L8,6H11V9H2V11H22V9H13V6H16L12,2Z"
          />
        </svg>
      </div>
    </PanelResizeHandle>
  );
};
