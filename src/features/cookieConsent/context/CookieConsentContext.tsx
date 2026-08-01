"use client";

import React, { createContext, useContext } from "react";

import { useCookieConsent } from "#/features/cookieConsent/hooks/useCookieConsent";

type CookieConsentContextValue = {
  openCookieSettings: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null,
);

export const useOptionalCookieConsentContext =
  (): CookieConsentContextValue | null => useContext(CookieConsentContext);

type CookieConsentProviderProps = {
  children: React.ReactNode;
  value: CookieConsentContextValue;
};

export const CookieConsentProvider: React.FC<CookieConsentProviderProps> = ({
  children,
  value,
}) => (
  <CookieConsentContext.Provider value={value}>
    {children}
  </CookieConsentContext.Provider>
);

export const useCookieConsentController = () => useCookieConsent();
