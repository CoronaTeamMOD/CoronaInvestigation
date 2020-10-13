import React from 'react';
import {useSelector} from 'react-redux';
import {Toolbar} from '@material-ui/core';
import {Typography} from '@material-ui/core';

import User from 'models/User';
import StoreStateType from 'redux/storeStateType';

import useStyles from './TopToolbarStyles';

const TopToolbar: React.FC = (): JSX.Element => {
    const classes = useStyles({});

    const user = useSelector<StoreStateType, User>(state => state.user);

    return (
        <Toolbar className={classes.toolbar} >
            <div className={classes.rightToolbarSection}>
                <img alt='logo' className={classes.logo} src='./assets/img/logo.png'></img>
                <Typography variant='h4' className={classes.centering}><div className={classes.systemName}>אבן יסוד</div></Typography>
            </div>
            <div className={classes.leftToolbarSection}>
                <Typography>שלום, {user.userName}</Typography>
            </div>
        </Toolbar>
    )
}

export default TopToolbar;
