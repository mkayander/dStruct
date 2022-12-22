import { alpha, Box, Divider, useTheme } from '@mui/material';
import React, { useMemo } from 'react';
import sanitizeHtml from 'sanitize-html';

import { DataSection } from '#/components';
import type { QuestionDataQueryResult } from '#/graphql/generated';

import styles from './DailyProblem.module.scss';

interface DailyProblemProps {
  questionDataQuery: QuestionDataQueryResult;
}

export const DailyProblem: React.FC<DailyProblemProps> = ({
  questionDataQuery,
}) => {
  const theme = useTheme();
  const question = questionDataQuery.data?.question;

  const sanitizedContent = useMemo(
    () =>
      question &&
      sanitizeHtml(question.content, {
        allowedTags: ['img', 'p', 'strong', 'ul', 'li', 'pre', 'code'],
      }),
    [question]
  );

  const loading = questionDataQuery.loading;

  return (
    <DataSection
      title={question?.title || 'Daily Problem'}
      caption="📅 Question Of Today"
      isLoading={loading}
    >
      {question && (
        <Box>
          <Box
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: sanitizedContent ?? '' }}
            sx={{
              img: {
                borderRadius: theme.shape.borderRadius,
              },
              pre: {
                my: 1,
                borderRadius: theme.shape.borderRadius,
                background: alpha(theme.palette.primary.dark, 0.1),
              },
            }}
          />
          <Divider />
        </Box>
      )}
    </DataSection>
  );
};
