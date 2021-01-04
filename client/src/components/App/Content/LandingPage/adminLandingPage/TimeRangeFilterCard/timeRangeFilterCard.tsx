import React, { ChangeEvent, useState } from 'react';
import { Card, CardActions, CardContent, Typography, FormControl, Select, MenuItem } from '@material-ui/core';

import { TimeRange } from 'models/TimeRange';
import timeRanges from 'models/enums/timeRanges';
import SelectDropdown from 'commons/Select/SelectDropdown';

import useStyles from './timeRangeFilterCardStyles';
import LoadingCard from '../LoadingCard/LoadingCard';
import UpdateButton from '../UpdateButton/UpdateButton';
import useTimeRangeFilterCard from './useTimeRangeFilterCard';
import AdminLandingPageFilters from '../AdminLandingPageFilters';

const filterTimeRangeLabel = 'טווח זמנים';

const TimeRangeCard = (props : Props): JSX.Element => {

    const classes = useStyles();
    const { timeRangeFilter, setTimeRangeFilter, investigationInfoFilter, setInvestigationInfoFilter } = props;
    const { isLoading, onTimeRangeChange, onUpdateButtonCLicked } = useTimeRangeFilterCard({
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