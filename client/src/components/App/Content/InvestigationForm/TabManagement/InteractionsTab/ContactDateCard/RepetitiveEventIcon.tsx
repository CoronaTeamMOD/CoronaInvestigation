import React from 'react';
import {Cached} from '@material-ui/icons';
import {Tooltip} from '@material-ui/core';
import useStyles from './RepetitiveEventIconStyles';

const RepetitiveEventIcon = () => {
    const classes = useStyles();
    return (
        <Tooltip className={classes.repeatIcon} title='אירוע מחזורי, מגעים באירוע מחזורי מופיעים באירוע האחרון בלבד.'>
            <Cached/>
        </Tooltip>
    );
};

export default RepetitiveEventIcon;