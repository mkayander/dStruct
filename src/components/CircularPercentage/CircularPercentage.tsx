import React from 'react';
import styles from './CircularPercentage.module.scss';
import { useTheme } from '@mui/material';

const SIZE = 44;

interface CircularPercentageProps extends React.PropsWithChildren {
    value?: number;
    size?: number;
    radius?: number;
    thickness?: number;
}

export const CircularPercentage: React.FC<CircularPercentageProps> = ({
    size = 128,
    thickness = 4.6,
    value = 0,
    children,
}) => {
    const theme = useTheme();

    const radius = (SIZE - thickness) / 2;

    const circleStyle: React.CSSProperties = {};
    const circumference = 2 * Math.PI * radius;
    circleStyle.strokeDasharray = circumference.toFixed(3);
    circleStyle.strokeDashoffset = `${(((100 - value) / 100) * circumference).toFixed(3)}px`;

    const sizePx = `${size}px`;

    return (
        <div
            className={styles.root}
            aria-valuenow={Math.round(value)}
            style={{
                height: sizePx,
                width: sizePx,
            }}
        >
            <svg viewBox="22 22 44 44">
                <circle
                    className={styles.bgCircle}
                    cx="44"
                    cy="44"
                    r={radius}
                    stroke={theme.palette.primary.dark}
                    strokeWidth={thickness}
                    fill="none"
                    style={{
                        opacity: 0.4,
                    }}
                />
                <circle
                    className={styles.mainCircle}
                    cx="44"
                    cy="44"
                    r={radius}
                    stroke={theme.palette.info.dark}
                    strokeWidth={thickness}
                    fill="none"
                    style={circleStyle}
                />
            </svg>
            <div className={styles.content}>{children ? children : `${value}%`}</div>
        </div>
    );
};
