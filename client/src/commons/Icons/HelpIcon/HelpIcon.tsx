import React from 'react'
import { Tooltip } from '@material-ui/core';
import HelpOutline from '@material-ui/icons/HelpOutline';

import useStyles from './helpIconStyles';

interface Props {
    title: string;
    isWarning: boolean;
}

const HelpIcon = (props : Props) => {
    const classes = useStyles();
    const { title , isWarning } = props;
    const iconClass = isWarning ? classes.warningIcon : classes.icon;

    return (
        <Tooltip title={title} arrow>
            <HelpOutline className={iconClass} />
        </Tooltip>
    )
}

export default HelpIcon;
