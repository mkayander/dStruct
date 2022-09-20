import React from 'react';
import { Box, Paper, SvgIcon, Typography } from '@mui/material';
import styles from './DataSection.module.scss';

interface DataSectionProps extends React.PropsWithChildren {
    title: string;
    Icon: typeof SvgIcon;
}

export const DataSection: React.FC<DataSectionProps> = ({ children, title, Icon }) => {
    return (
        <Paper
            className={styles.root}
            elevation={2}
            sx={{
                my: 4,
                p: 4,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <Typography variant="h5">{title}</Typography>
                <Icon color="primary" fontSize={'large'} />
            </Box>
            {children}
        </Paper>
    );
};
