"use client";

/**
 * Marketing home UI. Served from App Router (`internal-marketing/[locale]`); public `/` and `/{locale}` rewrite there via `proxy.ts`.
 */

import React from "react";

import { HomeLandingFaq } from "#/features/homePage/ui/landing/HomeLandingFaq";
import { HomeLandingHero } from "#/features/homePage/ui/landing/HomeLandingHero";
import { HomeLandingSections } from "#/features/homePage/ui/landing/HomeLandingSections";
import { useI18nContext } from "#/shared/hooks";
import { MainLayout } from "#/shared/ui/templates/MainLayout";

export const MarketingHomeView: React.FC = () => {
  const { LL } = useI18nContext();

  return (
    <MainLayout headerPosition="fixed">
      <HomeLandingHero LL={LL} />
      <HomeLandingSections LL={LL} />
      <HomeLandingFaq LL={LL} />
    </MainLayout>
  );
};
