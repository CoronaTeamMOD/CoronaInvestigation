import React from 'react';
import { Grid, Typography } from '@material-ui/core';

import DatePick from './DatePick'
import useStyles from './DateRangePickStyles';

const DateRangePick: React.FC<Props> = (props: Props): JSX.Element => {

    const { id, startDate, onStartDateChange, endDate, onEndDateChange, minDate, maxDate } = props;
    const classes = useStyles();

    return (
        <Grid item container alignItems='center' xs={12} spacing={1} id={id} direction='row' className={classes.mainRow}>
            <Grid item xs={6} className={classes.dateItem}>
                <DatePick
                    id={`${id}-start`}
                    minDate={minDate}
                    maxDate={maxDate}
                    value={startDate}
                    onChange={onStartDateChange}
                    helperText={null}
                />
            </Grid>
            <Grid item xs='auto'>
                <Typography align='center'>עד</Typography>
            </Grid>
            <Grid item xs={6} className={classes.dateItem}>
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
    id?: string;
    minDate?: Date;
    maxDate?: Date;
    startDate: string | Date;
    onStartDateChange: (date: Date) => void;
    endDate: string | Date;
    onEndDateChange: any;
};

export default DateRangePick;