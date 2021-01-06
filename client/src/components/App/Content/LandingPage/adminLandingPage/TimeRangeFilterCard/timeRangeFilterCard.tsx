import React, { ChangeEvent, useState } from 'react';
import { Card, CardActions, CardContent, Typography, FormControl, Select, MenuItem, Collapse } from '@material-ui/core';

import { TimeRange } from 'models/TimeRange';
import timeRanges from 'models/enums/timeRanges';
import SelectDropdown from 'commons/Select/SelectDropdown';
import DateRangePick from 'commons/DatePick/DateRangePick';

import useStyles from './timeRangeFilterCardStyles';
import LoadingCard from '../LoadingCard/LoadingCard';
import UpdateButton from '../UpdateButton/UpdateButton';
import useTimeRangeFilterCard from './useTimeRangeFilterCard';
import AdminLandingPageFilters from '../AdminLandingPageFilters';

const filterTimeRangeLabel = 'טווח זמנים';
const customTimeRangeId = -1;
const timeRangeMinDate = new Date(2020, 9, 1);

const TimeRangeCard = (props : Props): JSX.Element => {

    const classes = useStyles();
    const { timeRangeFilter, setTimeRangeFilter, investigationInfoFilter, setInvestigationInfoFilter } = props;
    const { isLoading, onTimeRangeChange, onUpdateButtonCLicked, onStartDateSelect, onEndDateSelect, errorMes} = useTimeRangeFilterCard({
        timeRangeFilter,
        setTimeRangeFilter,
        investigationInfoFilter,
        setInvestigationInfoFilter,
    });

    return (
        <LoadingCard isLoading={isLoading} className={classes.timeRangeCard}>
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
            <Collapse in={timeRangeFilter.id === customTimeRangeId} unmountOnExit className={classes.collapse}>
                <CardContent className={classes.dateRangeCardContent}>
                    <DateRangePick
                        startDate={timeRangeFilter.startDate}
                        onStartDateChange={onStartDateSelect}
                        endDate={timeRangeFilter.endDate}
                        onEndDateChange={onEndDateSelect}
                        minDate={timeRangeMinDate}
                        maxDate={new Date()}
                    />   
                    {errorMes !== '' && 
                        <Typography className={classes.timeRangeError}>{errorMes}</Typography>
                    }
                </CardContent>
            </Collapse>
            <CardActions className={classes.timeCardActions}>
                <UpdateButton
                    onClick={onUpdateButtonCLicked}
                />        
            </CardActions>
        </LoadingCard>
    )
};

interface Props {
    timeRangeFilter: TimeRange;
    setTimeRangeFilter: React.Dispatch<React.SetStateAction<TimeRange>>;
    investigationInfoFilter: AdminLandingPageFilters;
    setInvestigationInfoFilter: React.Dispatch<React.SetStateAction<AdminLandingPageFilters>>;
}

export default TimeRangeCard;