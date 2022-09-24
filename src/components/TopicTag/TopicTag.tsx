import React from 'react';
import { TopicTag as Topic } from '@src/graphql/generated';
import { Chip } from '@mui/material';

interface TopicTagProps {
    topic: Partial<Topic>;
}

export const TopicTag: React.FC<TopicTagProps> = ({ topic }) => {
    const handleClick = () => {
        console.log(topic.slug);
    };

    return <Chip label={topic.name} variant="filled" color="secondary" onClick={handleClick} />;
};
