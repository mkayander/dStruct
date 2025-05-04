import React from "react";

import { Switch } from "#/shadcn/ui/switch";

type BooleanToggleInputProps = {
  value: string;
  onChange(value: string): void;
  className?: string;
  disabled?: boolean;
};

export const BooleanToggleInput: React.FC<BooleanToggleInputProps> = ({
  value,
  onChange,
  className = "",
  disabled = false,
}) => {
  const isChecked = value === "true";

  const handleChange = (checked: boolean) => {
    onChange(checked ? "true" : "false");
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Switch
        checked={isChecked}
        onCheckedChange={handleChange}
        disabled={disabled}
      />
      <span className="text-sm text-zinc-700 dark:text-zinc-300">
        {isChecked ? "True" : "False"}
      </span>
    </div>
  );
};
