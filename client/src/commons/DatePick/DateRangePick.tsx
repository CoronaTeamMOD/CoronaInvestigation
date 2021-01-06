import React from 'react';
import { Grid, Typography } from '@material-ui/core';

import DatePick from './DatePick'

const DateRangePick: React.FC<Props> = (props: Props): JSX.Element => {

    const { startDate, onStartDateChange, endDate, onEndDateChange, minDate, maxDate } = props;

    return (
        <Grid container alignItems='center' xs={12} spacing={1}>
            <Grid item xs={5}>
                <DatePick
                    minDate={minDate}
                    maxDate={maxDate}
                    value={startDate}
                    onChange={onStartDateChange}
                />
            </Grid>
            <Grid item xs={2}>
                <Typography>עד</Typography>
            </Grid>
            <Grid item xs={5}>
                <DatePick
                    maxDate={maxDate}
                    value={endDate}
                    onChange={onEndDateChange}
                />
            </Grid>
        </Grid>
    );
};

export default DateRangePick;

interface Props {
  minDate?: Date,
  maxDate?: Date,
  startDate: string | Date;
  onStartDateChange: any;
  endDate: string | Date;
  onEndDateChange: any;
};