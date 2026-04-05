import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { fallbackProxy } from "#/context/I18nContext";
import { HomeLandingHeroPreviewRuntime } from "#/features/homePage/ui/landing/HomeLandingHeroPreviewRuntime";

const { createLandingHeroPreviewStoreMock } = vi.hoisted(() => ({
  createLandingHeroPreviewStoreMock: vi.fn(),
}));

vi.mock("#/features/homePage/model/landingHeroPreviewStore", () => ({
  createLandingHeroPreviewStore: createLandingHeroPreviewStoreMock,
}));

describe("HomeLandingHeroPreviewRuntime", () => {
  it("renders a visible error when the landing preview store fails to initialize", () => {
    createLandingHeroPreviewStoreMock.mockImplementationOnce(() => {
      throw new Error("Landing preview snapshot is missing callstack frames.");
    });

    render(<HomeLandingHeroPreviewRuntime LL={fallbackProxy} />);

    expect(
      screen.getByText("Landing preview failed to load."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Landing preview snapshot is missing callstack frames."),
    ).toBeInTheDocument();
  });
});
