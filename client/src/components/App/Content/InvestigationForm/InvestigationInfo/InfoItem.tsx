import React from 'react';
import {Typography} from '@material-ui/core';
import useStyles from './InfoItemStyles';

export interface InfoItemProps {
    name: string,
    value: string
}

const InfoItem = ({name, value}: InfoItemProps) => {
    const classes = useStyles();
    return (
        <Typography variant='body2' className={classes.typographyElement}>
            <b><bdi>{name}</bdi>: </b>
            {value}
        </Typography>
    );
};

export default InfoItem;