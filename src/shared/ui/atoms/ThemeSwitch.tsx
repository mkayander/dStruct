"use client";

import { useTheme } from "next-themes";
import React from "react";

import { Switch } from "#/shadcn/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "#/shadcn/ui/tooltip";

type ThemeSwitchProps = {
  className?: string;
};

export const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ className }) => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Switch
          checked={isDark}
          onCheckedChange={toggleTheme}
          className={className}
        />
      </TooltipTrigger>
      <TooltipContent>
        {isDark ? "Switch to light mode 🌞" : "Switch to dark mode 🌚"}
      </TooltipContent>
    </Tooltip>
  );
};
