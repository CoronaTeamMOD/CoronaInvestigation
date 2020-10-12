import React from 'react';
import { useSelector } from 'react-redux';
import { AppBar, Button, TextField, Toolbar } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

import User from 'models/User';
import StoreStateType from 'redux/storeStateType';

import useAppToolbar from './useAppToolbar';
import IsActiveToggle from './IsActiveToggle/IsActiveToggle';
import { KeyboardArrowDown } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';

const toggleMessage = 'מה הסטטוס שלך?';

const AppToolbar: React.FC = (): JSX.Element => {
    const { user, isActive, setUserActivityStatus, classes } = useAppToolbar();

    return (
        <AppBar className={classes.appBar} position='static'>
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
                    <Typography>הינך מחוברת ללשכת <b>באר שבוע</b> בדסק <b>שם דסק</b></Typography>
                </div>
            </Toolbar>
        </AppBar>
    )
}

export default AppToolbar;
