import React from 'react';
import { Toolbar } from '@material-ui/core';
import { Typography } from '@material-ui/core';

import useStyles from './TopToolbarStyles';

const TopToolbar: React.FC = (): JSX.Element => {
    const classes = useStyles({});
  
    return (
        <Toolbar className={classes.toolbar}>
            <div className={classes.rightToolbarSection}>
                <img alt='logo' className={classes.logo} src='./assets/img/logo.png'></img>
                <Typography variant='h4'><div className={classes.systemName}>שם המערכת</div></Typography>
            </div>
            <Typography>שלום, שם שלך</Typography>
        </Toolbar>
    )
}

export default TopToolbar;
