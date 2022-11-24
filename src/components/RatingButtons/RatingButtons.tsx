import React, { useMemo } from 'react';
import { Box, Button, ButtonGroup, useTheme } from '@mui/material';
import { ThumbDown, ThumbDownOutlined, ThumbUp, ThumbUpOutlined } from '@mui/icons-material';
import type { QuestionDataQuery } from '#/graphql/generated';

interface RatingButtonsProps {
    question: QuestionDataQuery['question'];
}

export const RatingButtons: React.FC<RatingButtonsProps> = ({ question }) => {
    const theme = useTheme();

    const likesPercentage = useMemo(
        () => (question.likes / (question.likes + question.dislikes)) * 100,
        [question.dislikes, question.likes]
    );

    return (
        <Box position="relative">
            <ButtonGroup variant="text" color={likesPercentage > 50 ? 'success' : 'error'}>
                <Button startIcon={question.isLiked ? <ThumbUp /> : <ThumbUpOutlined />} color="success">
                    {question.likes}
                </Button>
                <Button startIcon={question.isLiked === false ? <ThumbDown /> : <ThumbDownOutlined />} color="error">
                    {question.dislikes}
                </Button>
            </ButtonGroup>
            <Box
                sx={{
                    height: '4px',
                    width: '100%',
                    marginTop: '1px',
                    borderRadius: theme.shape.borderRadius,
                    background: theme.palette.error.dark,
                    overflow: 'hidden',
                }}
            >
                <Box
                    sx={{
                        height: '100%',
                        transition: '0.3s width',
                        width: `${likesPercentage}%`,
                        background: theme.palette.success.main,
                    }}
                ></Box>
            </Box>
        </Box>
    );
};
