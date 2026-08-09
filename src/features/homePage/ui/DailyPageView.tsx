"use client";

import {
  Alert,
  Box,
  Container,
  Grid,
  Link as MuiLink,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";

import { useDailyQuestionData } from "#/api";
import { DailyProblem } from "#/features/homePage/ui/DailyProblem/DailyProblem";
import { QuestionSummary } from "#/features/homePage/ui/QuestionSummary";
import { useI18nContext } from "#/shared/hooks";
import { MainLayout } from "#/shared/ui/templates/MainLayout";

/** Daily problem page content. Shared by Pages `/daily` and App Router pilot. */
export const DailyPageView: React.FC = () => {
  const { LL } = useI18nContext();
  const theme = useTheme();
  const questionDataQuery = useDailyQuestionData();
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "lg"));

  return (
    <MainLayout>
      <Box
        sx={{
          bgcolor: "background.default",
          py: { xs: 8, md: 12 },
        }}
      >
        <Container
          maxWidth={isMediumScreen ? "lg" : "xl"}
          sx={{ px: { xs: 2, sm: 3, md: 4 } }}
        >
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "text.primary",
                mb: 2,
              }}
            >
              {LL.HOME_DAILY_SECTION_TITLE()}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                mb: 4,
                maxWidth: 560,
                mx: "auto",
                lineHeight: 1.65,
              }}
            >
              {LL.HOME_DAILY_SECTION_LEAD()}{" "}
              <MuiLink
                href="https://leetcode.com/"
                target="_blank"
                rel="noreferrer"
                sx={{
                  color: "primary.main",
                  textDecoration: "none",
                  fontWeight: 600,
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                LeetCode
              </MuiLink>
            </Typography>
          </Box>

          {questionDataQuery.error ? (
            <Alert severity="error" sx={{ mb: 4 }}>
              {LL.HOME_DAILY_QUESTION_ERROR()}
            </Alert>
          ) : null}

          <Grid
            container
            spacing={4}
            sx={{
              justifyContent: "center",
            }}
          >
            <Grid size={{ xs: 12, lg: 8 }}>
              <QuestionSummary
                questionDataQuery={questionDataQuery}
                sx={{
                  mb: 4,
                  p: 3,
                  borderRadius: 2,
                  bgcolor: "background.paper",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <DailyProblem questionDataQuery={questionDataQuery} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </MainLayout>
  );
};
