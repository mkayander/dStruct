import {
  alpha,
  Box,
  Button,
  Container,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import React, { useCallback, useEffect, useRef } from "react";
import { type OrbitControls as ThreeOrbitControls } from "three-stdlib";

import { LANDING_PRIMARY_PLAYGROUND_HREF } from "#/features/homePage/lib/landingPlaygroundDemos";
import { HomeLandingHeroPreview } from "#/features/homePage/ui/landing/HomeLandingHeroPreview";
import type { TranslationFunctions } from "#/i18n/i18n-types";
import { useMobileLayout } from "#/shared/hooks";
import { LogoModelView } from "#/shared/ui/molecules/LogoModelView";

type HomeLandingHeroProps = {
  LL: TranslationFunctions;
};

const HERO_MODEL_BASE_AZIMUTH = Math.PI / 4.6;
const HERO_MODEL_BASE_POLAR = Math.PI / 2.5;
const HERO_MODEL_MAX_AZIMUTH_OFFSET = 0.28;
const HERO_MODEL_MAX_POLAR_OFFSET = 0.18;
const HERO_MODEL_DAMPING = 0.08;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const AmbientBackground = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        background: `radial-gradient(circle at 18% 18%, ${alpha(
          theme.appDesign.accent,
          0.16,
        )} 0%, transparent 42%), radial-gradient(circle at 82% 12%, ${alpha(
          theme.appDesign.accentSoft,
          0.12,
        )} 0%, transparent 36%), linear-gradient(180deg, ${alpha(
          theme.appDesign.surfaceLow,
          0.12,
        )} 0%, transparent 55%)`,
        pointerEvents: "none",
      }}
    />
  );
};

export const HomeLandingHero: React.FC<HomeLandingHeroProps> = ({ LL }) => {
  const theme = useTheme();
  const isMobileLayout = useMobileLayout();
  const controlsRef = useRef<ThreeOrbitControls>(null);
  const currentAzimuthRef = useRef(HERO_MODEL_BASE_AZIMUTH);
  const currentPolarRef = useRef(HERO_MODEL_BASE_POLAR);
  const targetAzimuthRef = useRef(HERO_MODEL_BASE_AZIMUTH);
  const targetPolarRef = useRef(HERO_MODEL_BASE_POLAR);

  const applyModelAngles = useCallback((azimuth: number, polar: number) => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.setAzimuthalAngle(azimuth);
    controls.setPolarAngle(polar);
    controls.update();
  }, []);

  const setModelRestingPosition = useCallback(() => {
    currentAzimuthRef.current = HERO_MODEL_BASE_AZIMUTH;
    currentPolarRef.current = HERO_MODEL_BASE_POLAR;
    targetAzimuthRef.current = HERO_MODEL_BASE_AZIMUTH;
    targetPolarRef.current = HERO_MODEL_BASE_POLAR;
    applyModelAngles(HERO_MODEL_BASE_AZIMUTH, HERO_MODEL_BASE_POLAR);
  }, [applyModelAngles]);

  const resetModelAngles = useCallback(() => {
    targetAzimuthRef.current = HERO_MODEL_BASE_AZIMUTH;
    targetPolarRef.current = HERO_MODEL_BASE_POLAR;
  }, []);

  const updateModelFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      if (isMobileLayout) return;

      if (
        !controlsRef.current ||
        window.innerWidth === 0 ||
        window.innerHeight === 0
      ) {
        return;
      }

      const xRatio = clientX / window.innerWidth - 0.5;
      const yRatio = clientY / window.innerHeight - 0.5;

      targetAzimuthRef.current =
        HERO_MODEL_BASE_AZIMUTH - xRatio * HERO_MODEL_MAX_AZIMUTH_OFFSET * 2;
      targetPolarRef.current = clamp(
        HERO_MODEL_BASE_POLAR + yRatio * HERO_MODEL_MAX_POLAR_OFFSET * 2,
        Math.PI / 2.9,
        Math.PI / 1.9,
      );
    },
    [isMobileLayout],
  );

  useEffect(() => {
    setModelRestingPosition();
  }, [setModelRestingPosition]);

  useEffect(() => {
    if (isMobileLayout) {
      setModelRestingPosition();
      return;
    }

    let frameId = 0;

    const animateModel = () => {
      const nextAzimuth =
        currentAzimuthRef.current +
        (targetAzimuthRef.current - currentAzimuthRef.current) *
          HERO_MODEL_DAMPING;
      const nextPolar =
        currentPolarRef.current +
        (targetPolarRef.current - currentPolarRef.current) * HERO_MODEL_DAMPING;

      currentAzimuthRef.current = nextAzimuth;
      currentPolarRef.current = nextPolar;
      applyModelAngles(nextAzimuth, nextPolar);

      frameId = window.requestAnimationFrame(animateModel);
    };

    const handleWindowMouseMove = (event: MouseEvent) => {
      updateModelFromPointer(event.clientX, event.clientY);
    };

    const handlePointerExit = () => {
      resetModelAngles();
    };

    window.addEventListener("mousemove", handleWindowMouseMove);
    window.addEventListener("blur", handlePointerExit);
    document.documentElement.addEventListener("mouseleave", handlePointerExit);
    frameId = window.requestAnimationFrame(animateModel);

    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("blur", handlePointerExit);
      document.documentElement.removeEventListener(
        "mouseleave",
        handlePointerExit,
      );
      window.cancelAnimationFrame(frameId);
    };
  }, [
    applyModelAngles,
    isMobileLayout,
    resetModelAngles,
    setModelRestingPosition,
    updateModelFromPointer,
  ]);

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "visible",
        bgcolor: "background.default",
        pt: { xs: 14, md: 18 },
        pb: { xs: 8, md: 10 },
      }}
    >
      <AmbientBackground />

      <Box
        sx={{
          position: "absolute",
          top: { xs: -88, sm: -170, md: -280 },
          right: { xs: -118, sm: -180, md: -320 },
          width: { xs: 460, sm: 700, md: 1180, lg: 1360 },
          height: { xs: 460, sm: 700, md: 1180, lg: 1360 },
          opacity: { xs: 0.12, md: 0.2 },
          filter: "blur(0.4px)",
          pointerEvents: "none",
          maskImage:
            "radial-gradient(circle at 48% 50%, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.9) 32%, rgba(0,0,0,0.46) 66%, transparent 90%)",
        }}
      >
        <LogoModelView
          controlsRef={controlsRef}
          interactive={false}
          cameraPosition={[1, 2.6, 22]}
          cameraFov={38}
          target={[0, 0.75, 0]}
          distanceRange={[18, 28]}
        />
      </Box>

      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "minmax(0, 5fr) minmax(0, 7fr)",
            },
            gap: { xs: 4, md: 6 },
            alignItems: "center",
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Stack spacing={2.5} sx={{ position: "relative", zIndex: 1 }}>
              <Typography
                variant="h1"
                sx={{
                  maxWidth: 700,
                  fontSize: { xs: "2.15rem", sm: "3.4rem", md: "4.8rem" },
                  lineHeight: { xs: 1.08, md: 1.02 },
                }}
              >
                {LL.HOME_LANDING_TITLE()}
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  maxWidth: 620,
                  fontSize: { xs: "1rem", md: "1.08rem" },
                  lineHeight: 1.75,
                }}
              >
                {LL.HOME_LANDING_SUBTITLE()}
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{ pt: 1 }}
              >
                <Button
                  component={Link}
                  data-testid="cta-to-playground"
                  href={LANDING_PRIMARY_PLAYGROUND_HREF}
                  variant="contained"
                  size="large"
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  {LL.TRY_IT_OUT_NOW()}
                </Button>
                <Button
                  component={Link}
                  href="/playground?view=browse"
                  variant="outlined"
                  size="large"
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  {LL.BROWSE_PROJECTS()}
                </Button>
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                alignItems={{ xs: "flex-start", sm: "center" }}
              >
                <Button
                  component={Link}
                  href="#faq"
                  variant="text"
                  color="inherit"
                >
                  {LL.HOME_HERO_FAQ_LINK()}
                  {LL.HOME_HERO_FAQ_LINK_SUFFIX()}
                </Button>
              </Stack>

              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap={true}
                sx={{ pt: 1 }}
              >
                <Box
                  sx={{
                    px: 1.25,
                    py: 0.75,
                    borderRadius: 99,
                    bgcolor: alpha(theme.appDesign.surfaceHigh, 0.82),
                    border: `1px solid ${alpha(theme.appDesign.outline, 0.14)}`,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {LL.HOME_LANG_JS_TITLE()}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    px: 1.25,
                    py: 0.75,
                    borderRadius: 99,
                    bgcolor: alpha(theme.appDesign.surfaceHigh, 0.82),
                    border: `1px solid ${alpha(theme.appDesign.outline, 0.14)}`,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {LL.HOME_LANG_PYTHON_TITLE()}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    px: 1.25,
                    py: 0.75,
                    borderRadius: 99,
                    bgcolor: alpha(theme.appDesign.surfaceHigh, 0.82),
                    border: `1px solid ${alpha(theme.appDesign.outline, 0.14)}`,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {LL.HOME_PILLAR_REPLAY_TITLE()}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                minWidth: 0,
                mx: { xs: "auto", lg: 0 },
              }}
            >
              <HomeLandingHeroPreview LL={LL} />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
