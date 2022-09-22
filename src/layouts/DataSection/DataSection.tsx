import React from 'react';
import { Box, Divider, Paper, SvgIcon, Typography, useTheme } from '@mui/material';
import styles from './DataSection.module.scss';

interface DataSectionProps extends React.PropsWithChildren {
    title: string;
    Icon: typeof SvgIcon;
}

export const DataSection: React.FC<DataSectionProps> = ({ children, title, Icon }) => {
    const theme = useTheme();

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
                marginBottom={1}
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <Typography variant="h5" color={theme.palette.primary.light}>
                    {title}
                </Typography>
                <Icon color="primary" fontSize={'large'} />
            </Box>
            <Divider />
            <Box marginTop={3}>{children}</Box>
        </Paper>
    );
};
