import React from 'react';
import { Grid, TextField, Typography } from '@material-ui/core';

import DatePick from './DatePick'

import { useStyles } from './DatePickStyles';

const DateRangePick: React.FC<Props> = (props: Props): JSX.Element => {

    const classes = useStyles();
    const { startDate, onStartDateChange, endDate, onEndDateChange, ...rest } = props;

    return (
        <Grid container direction={'row'} alignItems={'center'} xs={12} spacing={1}>
            <Grid item xs={5}>
                <DatePick
                    value={startDate}
                    onChange={onStartDateChange}
                />
            </Grid>
            <Grid item xs={2}>
                <Typography>עד</Typography>
            </Grid>
            <Grid item xs={5}>
                <DatePick
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
  startDate: any;
  onStartDateChange: any;
  endDate: any;
  onEndDateChange: any;
}
