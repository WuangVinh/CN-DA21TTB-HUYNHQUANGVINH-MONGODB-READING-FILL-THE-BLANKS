import React, { useState, useEffect } from 'react';
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    IconButton, 
    Avatar, 
    Menu, 
    MenuItem, 
    makeStyles 
} from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1,
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: theme.spacing(2),
    },
    username: {
        marginRight: theme.spacing(2),
    },
    avatar: {
        cursor: 'pointer',
        backgroundColor: theme.palette.primary.main,
    },
    link: {
        color: 'inherit',
        textDecoration: 'none',
    }
}));

const Header = () => {
    const classes = useStyles();
    const history = useHistory();
    const [user, setUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        // Kiểm tra người dùng đã đăng nhập
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            setUser(JSON.parse(loggedInUser));
        }
    }, []);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        history.push('/login');
        handleClose();
    };

    const handleProfile = () => {
        history.push('/profile');
        handleClose();
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" className={classes.title}>
                    <Link to="/" className={classes.link}>
                        English Quiz App
                    </Link>
                </Typography>

                {user ? (
                    <div className={classes.userInfo}>
                        <Typography className={classes.username}>
                            Welcome, {user.username}
                        </Typography>
                        <IconButton onClick={handleMenu}>
                            <Avatar className={classes.avatar}>
                                {user.username.charAt(0).toUpperCase()}
                            </Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleProfile}>Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </div>
                ) : (
                    <Link to="/login" className={classes.link}>
                        <IconButton color="inherit">
                            <Avatar />
                        </IconButton>
                    </Link>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;
