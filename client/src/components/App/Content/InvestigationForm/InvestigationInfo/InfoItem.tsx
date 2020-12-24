import React from 'react';
import { Typography } from '@material-ui/core';
import {Variant} from '@material-ui/core/styles/createTypography';

import useStyles from './InfoItemStyles';

const sizeVariantMap = {
    small: 'caption',
    regular: 'body2'
};

export interface InfoItemProps {
    name: string;
    value: string;
    testId?: string;
    size?: keyof typeof sizeVariantMap;
}

const InfoItem = ({ name, value, testId, size = 'regular' }: InfoItemProps) => {
    const classes = useStyles();
    const variant = sizeVariantMap[size] as Variant;
    return (
        <Typography variant={variant} className={classes.typographyElement} test-id={testId}>
            <b><bdi>{name}</bdi>: </b>
            {value}
        </Typography>
    );
};

export default InfoItem;
