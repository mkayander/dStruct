import React from 'react';
import { Box, Divider, lighten, LinearProgress, Paper, type SvgIcon, Typography, useTheme } from '@mui/material';
import styles from './DataSection.module.scss';

interface DataSectionProps extends React.PropsWithChildren {
    title: string;
    caption?: string | React.ReactNode;
    Icon?: typeof SvgIcon;
    isLoading?: boolean;
}

export const DataSection: React.FC<DataSectionProps> = ({ children, title, caption, Icon, isLoading }) => {
    const theme = useTheme();

    return (
        <Paper
            className={styles.root}
            elevation={2}
            sx={{
                my: 4,
                p: 4,
                borderRadius: theme.shape.borderRadius,
            }}
        >
            <Box
                marginBottom={1}
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <Box>
                    <Typography variant="h5" color={lighten(theme.palette.primary.light, 0.4)}>
                        {title}
                    </Typography>
                    {typeof caption === 'string' ? <Typography variant="subtitle2">{caption}</Typography> : caption}
                </Box>
                {Icon && <Icon color="primary" fontSize={'large'} />}
            </Box>
            <Divider />
            <Box marginTop={2}>{isLoading ? <LinearProgress variant="indeterminate" /> : children}</Box>
        </Paper>
    );
};
