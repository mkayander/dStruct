import { DOM_DISINTEGRATE_DEFAULTS } from "#/shared/ui/effects/domDisintegrate/constants";
import { getElementDisplaySize } from "#/shared/ui/effects/domDisintegrate/disintegrateCaptureSnapshot";
import { getDomDisintegrateQualityOverrides } from "#/shared/ui/effects/domDisintegrate/domDisintegrateQuality";
import type {
  DomDisintegrateOptions,
  ResolvedDomDisintegrateOptions,
} from "#/shared/ui/effects/domDisintegrate/types";

export const resolveDomDisintegrateOptions = (
  options?: DomDisintegrateOptions,
  element?: HTMLElement | null,
): ResolvedDomDisintegrateOptions => {
  const qualityOverrides =
    element !== undefined && element !== null
      ? getDomDisintegrateQualityOverrides(getElementDisplaySize(element))
      : {};

  return {
    ...DOM_DISINTEGRATE_DEFAULTS,
    ...qualityOverrides,
    ...options,
  };
};
