import React from 'react';
import { CardActions, CardContent, Typography, FormControl, Collapse, Card } from '@material-ui/core';

import { TimeRange } from 'models/TimeRange';
import SelectDropdown from 'commons/Select/SelectDropdown';
import DateRangePick from 'commons/DatePick/DateRangePick';
import timeRanges, { customTimeRange, timeRangeMinDate } from 'models/enums/timeRanges';

import useStyles from './TimeRangeFilterCardStyles';
import UpdateButton from '../UpdateButton/UpdateButton';
import useTimeRangeFilterCard from './useTimeRangeFilterCard';

const filterTimeRangeLabel = 'תאריך הגעת חקירה';

const TimeRangeCard = (props : Props): JSX.Element => {

    const classes = useStyles();
    const { onUpdateButtonClicked } = props;
    const { onTimeRangeChange, onStartDateSelect, onEndDateSelect, validateTimeRange, errorMes, timeRangeFilter } = useTimeRangeFilterCard();

    return (
        <Card className={classes.timeRangeCard}>
            <CardContent className={classes.timeRangeCardContent}>
                <Typography className={classes.cardTitle} id='time-range-filter-title'>
                    <b>{filterTimeRangeLabel}</b>
                </Typography>
                <FormControl variant='outlined' className={classes.timeRangeSelect}>
                    <SelectDropdown
                        id='time-range-filter-dropdown'
                        onChange={onTimeRangeChange}
                        items={timeRanges}
                        value={timeRangeFilter.id}
                    />
                    
                </FormControl>
            </CardContent>
            <Collapse in={timeRangeFilter.id === customTimeRange.id} unmountOnExit className={classes.collapse}>
                <CardContent className={classes.dateRangeCardContent}>
                    <DateRangePick
                        id='time-range-filter-datepick'
                        startDate={timeRangeFilter.startDate}
                        onStartDateChange={onStartDateSelect}
                        endDate={timeRangeFilter.endDate}
                        onEndDateChange={onEndDateSelect}
                        minDate={timeRangeMinDate}
                        maxDate={new Date()}
                    />   
                    {errorMes && <Typography id='time-range-error-message' className={classes.timeRangeError}>{errorMes}</Typography>}
                </CardContent>
            </Collapse>
            <CardActions className={classes.timeCardActions}>
                <UpdateButton
                    onClick={() => validateTimeRange() && onUpdateButtonClicked(timeRangeFilter)}
                    text='עדכון'
                />        
            </CardActions>
        </Card>
    )
};

interface Props {
    onUpdateButtonClicked: (timeRangeFilter: TimeRange) => void;
};
export default TimeRangeCard;