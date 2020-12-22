import React from 'react'
import { Tooltip } from '@material-ui/core'

import useStyles from './ColorColumnStyles';

interface Props {
    reason: string;
    color: string;
}

export const ColorColumn = ({ reason, color }: Props) => {
    const classes = useStyles();

    return (
        <Tooltip
            arrow
            placement='top'
            title={reason}
        >
            <div className={classes.groupColor}
                style={{ backgroundColor: color }}
            />
        </Tooltip>
    )
}
