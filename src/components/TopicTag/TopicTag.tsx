import React from 'react';
import type { TopicTag as Topic } from '#/graphql/generated';
import { alpha, Chip, darken, useTheme } from '@mui/material';

interface TopicTagProps {
    topic: Partial<Topic>;
}

export const TopicTag: React.FC<TopicTagProps> = ({ topic }) => {
    const theme = useTheme();

    const colors = theme.palette.question.getTagColors(topic.slug);

    const handleClick = () => {
        console.log(topic.slug);
    };

    return (
        <Chip
            label={topic.name}
            variant="filled"
            onClick={handleClick}
            sx={{
                color: alpha(theme.palette.primary.contrastText, 0.9),
                background: `linear-gradient(55deg, ${darken(colors[0], 0.4)} 0%, ${colors[1]} 100%)`,
                fontWeight: 'bold',
                letterSpacing: '1px',
                lineHeight: '2rem',
            }}
        />
    );
};
