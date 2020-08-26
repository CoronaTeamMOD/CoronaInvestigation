import React from 'react';
import { Typography, Icon } from '@material-ui/core';
import { Toolbar } from '@material-ui/core';
import HeadsetIcon from '@material-ui/icons/Headset';

import useStyles from './TopToolbarStyles';

const TopToolbar: React.FC = (): JSX.Element => {
    const classes = useStyles({});
  
    return (
        <Toolbar className={classes.toolbar}>
            <Typography>שלום, שם שלך</Typography>
            <div className={classes.systemName}>
                <Typography>שם המערכת</Typography>
                <Icon className={classes.logo}>
                    <HeadsetIcon />
                </Icon>
            </div>
        </Toolbar>
    )
}

export default TopToolbar;
