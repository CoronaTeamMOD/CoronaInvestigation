import React from 'react';
import { CardActions, CardContent, Typography, FormControl, Collapse, Card } from '@material-ui/core';

import { TimeRange } from 'models/TimeRange';
import timeRanges, { customTimeRange, timeRangeMinDate } from 'models/enums/timeRanges';
import SelectDropdown from 'commons/Select/SelectDropdown';
import DateRangePick from 'commons/DatePick/DateRangePick';

import useStyles from './TimeRangeFilterCardStyles';
import UpdateButton from '../UpdateButton/UpdateButton';
import useTimeRangeFilterCard from './useTimeRangeFilterCard';

const filterTimeRangeLabel = 'תאריך הגעת חקירה';

const TimeRangeCard = (props : Props): JSX.Element => {

    const classes = useStyles();
    const { onUpdateButtonClicked } = props;
    const { onTimeRangeChange, onStartDateSelect, onEndDateSelect, validateTimeRange, errorMes, timeRangeFilter} = useTimeRangeFilterCard();

    return (
        <Card className={classes.timeRangeCard}>
            <CardContent className={classes.timeRangeCardContent}>
                <Typography className={classes.cardTitle}>
                    <b>{filterTimeRangeLabel}</b>
                </Typography>
                <FormControl variant='outlined' className={classes.timeRangeSelect}>
                    <SelectDropdown
                        onChange={onTimeRangeChange}
                        items={timeRanges}
                        value={timeRangeFilter.id}
                    />
                    
                </FormControl>
            </CardContent>
            <Collapse in={timeRangeFilter.id === customTimeRange.id} unmountOnExit className={classes.collapse}>
                <CardContent className={classes.dateRangeCardContent}>
                    <DateRangePick
                        startDate={timeRangeFilter.startDate}
                        onStartDateChange={onStartDateSelect}
                        endDate={timeRangeFilter.endDate}
                        onEndDateChange={onEndDateSelect}
                        minDate={timeRangeMinDate}
                        maxDate={new Date()}
                    />   
                    {errorMes && <Typography className={classes.timeRangeError}>{errorMes}</Typography>}
                </CardContent>
            </Collapse>
            <CardActions className={classes.timeCardActions}>
                <UpdateButton
                    onClick={() => validateTimeRange() && onUpdateButtonClicked(timeRangeFilter)}
                />        
            </CardActions>
        </Card>
    )
};

interface Props {
    onUpdateButtonClicked: (timeRangeFilter: TimeRange) => void;
}

export default TimeRangeCard;