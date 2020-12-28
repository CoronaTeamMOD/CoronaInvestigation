import React from 'react';
import { Card, CardActions, CardContent, Typography } from '@material-ui/core';

import DatePick from 'commons/DatePick/DatePick';

import useStyles from './timeRangeCardStyles';
import UpdateButton from '../UpdateButton/UpdateButton';

const TimeRangeCard: React.FC = (): JSX.Element => {
    const classes = useStyles();

    return (
        <Card className={classes.timeRangeCard}>
            <CardContent className={classes.timeRangeCardContent}>
                <Typography className={classes.cardTitle}>
                    <b>טווח זמנים</b>
                </Typography>
                <DatePick
                    value={new Date()}
                    onChange={() => { }}
                />
            </CardContent>
            <CardActions className={classes.timeCardActions}>
                <UpdateButton/>
            </CardActions>
        </Card>
    )
}

export default TimeRangeCard;
