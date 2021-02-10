import React from 'react';
import { Grid, Typography } from '@material-ui/core';

import DatePick from './DatePick'
import useStyles from './DateRangePickStyles';

const DateRangePick: React.FC<Props> = (props: Props): JSX.Element => {

    const { id, startDate, onStartDateChange, endDate, onEndDateChange, minDate, maxDate } = props;
    const classes = useStyles();

    return (
        <Grid item container alignItems='center' xs={12} spacing={1} id={id}>
            <Grid item xs={5} className={classes.dateItem}>
                <DatePick
                    id={`${id}-start`}
                    minDate={minDate}
                    maxDate={maxDate}
                    value={startDate}
                    onChange={onStartDateChange}
                    helperText={null}
                />
            </Grid>
            <Grid item xs={2}>
                <Typography align='center'>עד</Typography>
            </Grid>
            <Grid item xs={5} className={classes.dateItem}>
                <DatePick
                    id={`${id}-end`}
                    maxDate={maxDate}
                    value={endDate}
                    onChange={onEndDateChange}
                    helperText={null}
                />
            </Grid>
        </Grid>
    );
};

interface Props {
    id? : string;
    minDate?: Date;
    maxDate?: Date;
    startDate: string | Date;
    onStartDateChange: any;
    endDate: string | Date;
    onEndDateChange: any;
};

export default DateRangePick;