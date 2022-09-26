import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import { PaletteColor } from '@mui/material';
import { Difficulty } from '@src/graphql/generated';

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

    getTagColors(slug?: string) {
        switch (slug) {
            case 'queue':
                return ['#509e26', '#b2eb50'];
            case 'design':
                return ['#395af9', '#aacafd'];
            case 'array':
                return ['#095abd', '#009ab2'];
            case 'dynamic-programming':
                return ['#15b792', '#45e88c'];
            case 'graph':
                return ['#abaeff', '#93b9bc'];
            case 'linked-list':
                return ['#feaa7b', '#abaeff'];
            case 'heap':
                return ['#ec75b1', '#f7cae0'];
            default:
                return [theme.palette.secondary.dark, theme.palette.secondary.light];
        }
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
