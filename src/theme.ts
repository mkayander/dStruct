import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import type { PaletteColor } from '@mui/material';
import type { Difficulty } from '#/graphql/generated';

// Create a theme instance.
const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#556cd6',
        },
        secondary: {
            main: '#19857b',
        },
        error: {
            main: red.A400,
        },
    },
});

const tagColors: Record<string, [string, string]> = {
    'two-pointers': ['#009ab2', '#095abd'],
    'union-find': ['#2a40a6', '#00d9ff'],
    string: ['#a35382', '#70ceac'],
    queue: ['#509e26', '#b2eb50'],
    design: ['#395af9', '#aacafd'],
    array: ['#095abd', '#009ab2'],
    'dynamic-programming': ['#15b792', '#45e88c'],
    graph: ['#abaeff', '#93b9bc'],
    'linked-list': ['#feaa7b', '#abaeff'],
    heap: ['#ec75b1', '#f7cae0'],
};

theme.palette.question = {
    All: theme.palette.augmentColor({
        name: 'All',
        color: {
            main: theme.palette.primary.light,
        },
    }),
    Easy: theme.palette.augmentColor({
        name: 'Easy',
        color: {
            main: '#4bffea',
        },
    }),
    Medium: theme.palette.augmentColor({
        name: 'Medium',
        color: {
            // main: '#ffc52f',
            main: theme.palette.warning.main,
        },
    }),
    Hard: theme.palette.augmentColor({
        name: 'Hard',
        color: {
            // main: '#ff4066',
            main: theme.palette.error.main,
        },
    }),

    getTagColors(slug?: string): [string, string] {
        if (slug && slug in tagColors) {
            return tagColors[slug] as [string, string];
        }

        const colors = Object.values(tagColors);
        const randomIndex = Math.floor(Math.random() * colors.length);

        return colors[randomIndex] as [string, string];
    },
};

export default theme;

declare module '@mui/material/styles' {
    interface Palette {
        question: Record<Difficulty, PaletteColor> & {
            getTagColors(slug?: string): [string, string];
        };
    }
}
