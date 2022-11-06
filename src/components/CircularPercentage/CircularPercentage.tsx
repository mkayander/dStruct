import React, { useEffect, useState } from 'react';
import styles from './CircularPercentage.module.scss';
import { useTheme } from '@mui/material';

const SIZE = 44;
const VIEW_BOX = `${SIZE / 2} ${SIZE / 2} ${SIZE} ${SIZE}`;

interface CircularPercentageProps extends React.PropsWithChildren {
    value?: number;
    size?: number;
    radius?: number;
    thickness?: number;

    bgColor?: string;
}

export const CircularPercentage: React.FC<CircularPercentageProps> = ({
    size = 128,
    thickness = 4.6,
    value = 0,
    bgColor,
    children,
}) => {
    const theme = useTheme();

    const [displayedLevel, setDisplayedLevel] = useState(0);
    useEffect(() => {
        setDisplayedLevel(value);
    }, [value]);

    const radius = (SIZE - thickness) / 2;

    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference.toFixed(3);
    const strokeDashoffset = `${(((100 - displayedLevel) / 100) * circumference).toFixed(3)}px`;

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
            <svg viewBox={VIEW_BOX}>
                <defs>
                    <linearGradient id="circle-gradient" x1="100%" y1="-30%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor={theme.palette.error.light} />
                        <stop offset="20%" stopColor={theme.palette.info.dark} />
                        <stop offset="50%" stopColor={theme.palette.info.light} />
                        <stop offset="100%" stopColor={theme.palette.success.main} />
                    </linearGradient>
                </defs>
                <circle
                    className={styles.bgCircle}
                    cx={SIZE}
                    cy={SIZE}
                    r={radius}
                    stroke={bgColor || theme.palette.primary.dark}
                    strokeWidth={thickness}
                    fill="none"
                    style={{
                        opacity: 0.4,
                    }}
                />
                <circle
                    className={styles.mainCircle}
                    cx={SIZE}
                    cy={SIZE}
                    r={radius}
                    stroke="url(#circle-gradient)"
                    strokeWidth={thickness}
                    fill="none"
                    style={{
                        strokeDasharray,
                        strokeDashoffset,
                    }}
                />
            </svg>
            <div className={styles.content}>{children ? children : `${value?.toFixed(2)}%`}</div>
        </div>
    );
};
