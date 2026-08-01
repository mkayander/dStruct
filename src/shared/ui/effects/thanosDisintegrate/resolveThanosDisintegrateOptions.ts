import { THANOS_DISINTEGRATE_DEFAULTS } from "#/shared/ui/effects/thanosDisintegrate/constants";
import type {
  ResolvedThanosDisintegrateOptions,
  ThanosDisintegrateOptions,
} from "#/shared/ui/effects/thanosDisintegrate/types";

export const resolveThanosDisintegrateOptions = (
  options?: ThanosDisintegrateOptions,
): ResolvedThanosDisintegrateOptions => ({
  ...THANOS_DISINTEGRATE_DEFAULTS,
  ...options,
});
