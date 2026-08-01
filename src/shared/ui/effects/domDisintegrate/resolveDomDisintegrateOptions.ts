import { DOM_DISINTEGRATE_DEFAULTS } from "#/shared/ui/effects/domDisintegrate/constants";
import type {
  DomDisintegrateOptions,
  ResolvedDomDisintegrateOptions,
} from "#/shared/ui/effects/domDisintegrate/types";

export const resolveDomDisintegrateOptions = (
  options?: DomDisintegrateOptions,
): ResolvedDomDisintegrateOptions => ({
  ...DOM_DISINTEGRATE_DEFAULTS,
  ...options,
});
