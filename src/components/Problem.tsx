import React from 'react';
import { ProblemList } from '@prisma/client';

export type ProblemProps = {
    data: ProblemList;
};

export const Problem: React.FC<ProblemProps> = ({ data }) => {
    return (
        <div>
            <h4>Problem</h4>
            <span>{data.id}</span>
            <span>{data.title}</span>
            <span>{data.solved}</span>
            <span>{JSON.stringify(data, null, 2)}</span>
        </div>
    );
};
