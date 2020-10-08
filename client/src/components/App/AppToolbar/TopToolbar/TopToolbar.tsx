import React from 'react';
import { useSelector } from 'react-redux';
import { AppBar, Toolbar } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

import User from 'models/User';
import StoreStateType from 'redux/storeStateType';

import useStyles from './TopToolbarStyles';
import useTopToolbar from './useTopToolbar';
import IsActiveToggle from './IsActiveToggle/IsActiveToggle';

const toggleMessage = 'מה הסטטוס שלך?';

const TopToolbar: React.FC = (): JSX.Element => {
    const classes = useStyles({});
    const firstUserUpdate = React.useRef(true);

    const user = useSelector<StoreStateType, User>(state => state.user);

    const [isActive, setIsActive] = React.useState<boolean>(false);

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
                    <img alt='logo' src='./assets/img/logo.png' width={48} height={48}/>
                    <Typography variant='h4' >אבן יסוד</Typography>
                </div>
                <div className={classes.userSection}>
                    <Tooltip title={toggleMessage} arrow>
                        <IsActiveToggle value={isActive} setUserActivityStatus={setUserActivityStatus} exclusive />
                    </Tooltip>
                    <Typography variant='h6' className={classes.greetUserText}>שלום, {user.userName}</Typography>
                    <Typography variant='h6'>דסק: </Typography>
                </div>
            </Toolbar>
        </AppBar>
    )
}

export default TopToolbar;
