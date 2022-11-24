import React, { useState, type MouseEvent } from 'react';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
    AppBar,
    Avatar,
    Box,
    Container,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography,
    Button,
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import MenuIcon from '@mui/icons-material/Menu';
import { useProfileImageUploader } from '#/hooks';
import { getImageUrl } from '#/utils';
import Image from 'next/image';

const AVATAR_PLACEHOLDER = '/avatars/placeholder.png';

type NavItem = {
    name: string;
    href: string;
};

const pages = [
    {
        name: 'Dashboard',
        href: '/dashboard',
    },
    {
        name: 'Pricing',
        href: '/',
    },
    {
        name: 'API',
        href: '/api-example',
    },
] as const;

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export const MainAppBar: React.FC = () => {
    const router = useRouter();

    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const session = useSession();

    useProfileImageUploader(session);

    const handleSignIn = async () => {
        await signIn();
    };

    const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleNavItemClick = (item: NavItem) => {
        void router.push(item.href);
    };

    return (
        <AppBar position="static" elevation={10}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <CodeIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    {/* TODO: Remove legacyBehavior - issue with nested MUI links https://github.com/mui/material-ui/issues/34898 */}
                    <Link href="/" legacyBehavior={true}>
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            LeetPal
                        </Typography>
                    </Link>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.name} onClick={() => handleNavItemClick(page)}>
                                    <Typography textAlign="center">{page.name}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <CodeIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Link href="/" legacyBehavior={true}>
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            LeetPal
                        </Typography>
                    </Link>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page.name}
                                onClick={() => handleNavItemClick(page)}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page.name}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        {session.data ? (
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar>
                                        <Image
                                            src={getImageUrl(session.data.user.bucketImage || AVATAR_PLACEHOLDER)}
                                            alt={`${session.data.user.name} avatar`}
                                            referrerPolicy="no-referrer"
                                            fill={true}
                                        />
                                    </Avatar>
                                </IconButton>
                            </Tooltip>
                        ) : (
                            <Button color="inherit" onClick={handleSignIn}>
                                Sign In
                            </Button>
                        )}

                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                    <Typography textAlign="center">{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
