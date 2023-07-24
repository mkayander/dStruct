// import type React from 'react';
import { createContext } from "react";

export type ConfigContextType = {
  newProjectMarginMs?: number;
};

export const ConfigContext = createContext<ConfigContextType>({});
