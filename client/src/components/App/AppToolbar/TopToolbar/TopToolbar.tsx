import React from 'react';
import { useSelector } from 'react-redux';
import { AppBar, Button, Menu, MenuItem, Toolbar } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

import User from 'models/User';
import StoreStateType from 'redux/storeStateType';

import useStyles from './TopToolbarStyles';
import useTopToolbar from './useTopToolbar';
import IsActiveToggle from './IsActiveToggle/IsActiveToggle';
import { KeyboardArrowDown } from '@material-ui/icons';

const toggleMessage = 'מה הסטטוס שלך?';

const TopToolbar: React.FC = (): JSX.Element => {
    const classes = useStyles();
    const firstUserUpdate = React.useRef(true);

    const user = useSelector<StoreStateType, User>(state => state.user);

    const [isActive, setIsActive] = React.useState<boolean>(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const { getUserActivityStatus, setUserActivityStatus } = useTopToolbar({ setIsActive });

    React.useEffect(() => {
        if (firstUserUpdate.current) {
            firstUserUpdate.current = false;
        } else {
            getUserActivityStatus();
        }
    }, [user])

    return (
        <AppBar>
            <Toolbar >
                <div className={classes.logoTitle}>
                    <img alt='logo' src='./assets/img/logo.png' width={48} height={48} />
                    <Typography variant='h4' >אבן יסוד</Typography>
                </div>
                <div className={classes.userSection}>
                    <Tooltip title={toggleMessage} arrow>
                        <IsActiveToggle value={isActive} setUserActivityStatus={setUserActivityStatus} exclusive />
                    </Tooltip>
                    <Typography className={classes.greetUserText}>שלום, {user.userName}</Typography>
                    <Typography>דסק:&nbsp;</Typography>
                    <Button
                        color='inherit'
                        aria-controls='desk-menu'
                        aria-haspopup='true'
                        onClick={handleClick}
                        endIcon={<KeyboardArrowDown />}
                        >
                        באר שבוע
                    </Button>
                    <Menu
                        id='desk-menu'
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem selected onClick={handleClose}>באר שבוע</MenuItem>
                        <MenuItem onClick={handleClose}>תל אבוב</MenuItem>
                        <MenuItem onClick={handleClose}>רמת גון</MenuItem>
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    )
}

export default TopToolbar;
