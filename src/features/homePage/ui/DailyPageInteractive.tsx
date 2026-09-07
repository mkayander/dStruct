"use client";

import { Alert, Grid } from "@mui/material";
import React from "react";

import { useDailyQuestionData } from "#/api";
import { DailyProblem } from "#/features/homePage/ui/DailyProblem/DailyProblem";
import { QuestionSummary } from "#/features/homePage/ui/QuestionSummary";
import { useI18nContext } from "#/shared/hooks";

/** Client island: daily question data, summary, and interactive problem UI. */
export const DailyPageInteractive: React.FC = () => {
  const { LL } = useI18nContext();
  const questionDataQuery = useDailyQuestionData();

  return (
    <>
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
    </>
  );
};
