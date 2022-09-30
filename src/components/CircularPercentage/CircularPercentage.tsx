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
    mainColor?: string;
}

export const CircularPercentage: React.FC<CircularPercentageProps> = ({
    size = 128,
    thickness = 4.6,
    value = 0,
    mainColor,
    bgColor,
    children,
}) => {
    const theme = useTheme();

    const [displayedLevel, setDisplayedLevel] = useState(0);
    useEffect(() => {
        setDisplayedLevel(value);
    }, [value]);

    const radius = (SIZE - thickness) / 2;

    const circleStyle: React.CSSProperties = {};
    const circumference = 2 * Math.PI * radius;
    circleStyle.strokeDasharray = circumference.toFixed(3);
    circleStyle.strokeDashoffset = `${(((100 - displayedLevel) / 100) * circumference).toFixed(3)}px`;

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
                    stroke={mainColor || theme.palette.info.dark}
                    strokeWidth={thickness}
                    fill="none"
                    style={circleStyle}
                />
            </svg>
            <div className={styles.content}>{children ? children : `${value?.toFixed(2)}%`}</div>
        </div>
    );
};
