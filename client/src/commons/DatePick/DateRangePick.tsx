import React from 'react';
import { Grid, Typography } from '@material-ui/core';

import DatePick from './DatePick'
import useStyles from './DateRangePickStyles';

const DateRangePick: React.FC<Props> = (props: Props): JSX.Element => {

    const { startDate, onStartDateChange, endDate, onEndDateChange, minDate, maxDate } = props;
    const classes = useStyles();

    return (
        <Grid container alignItems='center' xs={12} justify='space-between'>
            <Grid item xs={5} className={classes.dateItem}>
                <DatePick
                    minDate={minDate}
                    maxDate={maxDate}
                    value={startDate}
                    onChange={onStartDateChange}
                />
            </Grid>
            <Grid item xs={1}>
                <Typography className={classes.text}>עד</Typography>
            </Grid>
            <Grid item xs={5} className={classes.dateItem}>
                <DatePick
                    maxDate={maxDate}
                    value={endDate}
                    onChange={onEndDateChange}
                />
            </Grid>
        </Grid>
    );
};

interface Props {
    minDate?: Date,
    maxDate?: Date,
    startDate: string | Date;
    onStartDateChange: any;
    endDate: string | Date;
    onEndDateChange: any;
};

export default DateRangePick;