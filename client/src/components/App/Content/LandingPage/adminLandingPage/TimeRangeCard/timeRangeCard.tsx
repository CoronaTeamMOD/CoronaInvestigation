import React from 'react';
import { Button, Card, CardActions, CardContent, Typography } from '@material-ui/core';

import DatePick from 'commons/DatePick/DatePick';

import useStyles from './timeRangeCardStyles';

const TimeRangeCard: React.FC = (): JSX.Element => {
    const classes = useStyles();

    return (
        <Card className={classes.timeRangeCard}>
            <CardContent className={classes.TimeRangeCardContent}>
                <Typography variant='h6' className={classes.cardTitle}>
                    <b>טווח זמנים</b>
                </Typography>
                <DatePick
                    value={new Date()}
                    onChange={() => { }}
                />
            </CardContent>
            <CardActions style={{ direction: 'ltr', paddingLeft: '1vw' }}>
                <Button
                    className={classes.updateButton}
                    variant='contained'
                    size='small'>
                    עדכון
                    </Button>
            </CardActions>
        </Card>
    )
}

export default TimeRangeCard;
