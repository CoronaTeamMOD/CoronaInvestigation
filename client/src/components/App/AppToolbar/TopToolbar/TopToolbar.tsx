import React from 'react';
import { Toolbar } from '@material-ui/core';
import { Typography } from '@material-ui/core';

import useStyles from './TopToolbarStyles';

const TopToolbar: React.FC = (): JSX.Element => {
    const classes = useStyles({});
  
    return (
        <Toolbar className={classes.toolbar}>
            <Typography>שלום, שם שלך</Typography>
            <div className={classes.RightDiv}>
                <Typography><div className={classes.systemName}>שם המערכת</div></Typography>
                <img alt='logo' className={classes.logo} src='./assets/img/logo1.png'></img>
            </div>
        </Toolbar>
    )
}

export default TopToolbar;
