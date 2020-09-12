import React from 'react';
import { Typography } from '@material-ui/core';
import useStyles from './InfoItemStyles';

export interface InfoItemProps {
    name: string,
    value: string,
    testId?: string
}

const InfoItem = ({ name, value, testId }: InfoItemProps) => {
    const classes = useStyles();
    return (
        <Typography variant='body2' className={classes.typographyElement} test-id={testId}>
            <b><bdi>{name}</bdi>: </b>
            {value}
        </Typography>
    );
};

export default InfoItem;