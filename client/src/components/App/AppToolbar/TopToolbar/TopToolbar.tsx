import React from 'react';
import {useSelector} from 'react-redux';
import {Toolbar} from '@material-ui/core';
import {Typography} from '@material-ui/core';

import useStyles from './TopToolbarStyles';
import StoreStateType from 'redux/storeStateType';

const TopToolbar: React.FC = (): JSX.Element => {
    const classes = useStyles({});
    const userName = useSelector<StoreStateType, string>(state => state.user.name);
  
    return (
        <Toolbar className={classes.toolbar}>
            <div className={classes.rightToolbarSection}>
                <img alt='logo' className={classes.logo} src='./assets/img/logo.png'></img>
                <Typography variant='h4'><div className={classes.systemName}>שם המערכת</div></Typography>
            </div>
            <Typography>שלום, {userName}</Typography>
        </Toolbar>
    )
}

export default TopToolbar;
