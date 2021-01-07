import React from 'react'
import { Close } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { Card, Checkbox, Collapse, FormControl, IconButton, TextField, Typography } from '@material-ui/core';

import { TimeRange } from 'models/TimeRange';
import timeRanges from 'models/enums/timeRanges';
import DateRangePick from 'commons/DatePick/DateRangePick';
import SelectDropdown from 'commons/Select/SelectDropdown';
import InvestigationMainStatus from 'models/InvestigationMainStatus';

import useStyles from './TableFilterStyles';
import { StatusFilter as StatusFilterType } from '../InvestigationTableInterfaces';
import useTableFilter from './useTableFilter';

const filterTimeRangeLabel = 'ת. הגעת חקירה';
const customTimeRangeId = -1;
const timeRangeMinDate = new Date(2020, 9, 1);

const TableFilter = (props: Props) => {

    const classes = useStyles();

    const { 
        statuses, filteredStatuses, 
        onFilterChange, onClose, 
        changeInactiveUserFilter, inactiveUserFilter, 
        changeUnassginedUserFilter, unassignedUserFilter, 
        timeRangeFilter, onTimeRangeFilterChange
    } = props;

    const { displayTimeRange, onSelectTimeRangeChange, onStartDateSelect, onEndDateSelect, errorMes} = useTableFilter({
        timeRangeFilter, 
        onTimeRangeFilterChange
    });

    return (
        <Card className={classes.card}>
            <Typography className={classes.title} >
                <b>סינון לפי </b>
            </Typography>
            <Typography className={classes.title}>
                <b>{filterTimeRangeLabel}</b>
            </Typography>
            <FormControl variant='outlined'>
                <SelectDropdown
                    onChange={onSelectTimeRangeChange}
                    items={timeRanges}
                    value={displayTimeRange.id}
                />
            </FormControl>
            <Collapse in={timeRangeFilter.id === customTimeRangeId} unmountOnExit>
                <DateRangePick
                    startDate={displayTimeRange.startDate}
                    onStartDateChange={onStartDateSelect}
                    endDate={displayTimeRange.endDate}
                    onEndDateChange={onEndDateSelect}
                    minDate={timeRangeMinDate}
                    maxDate={new Date()}
                />   
                {errorMes !== '' && 
                    <Typography className={classes.timeRangeError}>{errorMes}</Typography>
                }
            </Collapse>
            <Typography className={classes.title} >
                <b>סטטוס</b>
            </Typography>
            <Autocomplete
                ChipProps={{className:classes.chip}}
                className={classes.autocomplete}
                size='small'
                disableCloseOnSelect
                multiple
                options={statuses}
                value={statuses.filter(status => filteredStatuses.includes(status.id))}
                getOptionLabel={(option) => option.displayName}
                onChange={onFilterChange}
                renderInput={(params) =>
                    <TextField
                        size='small'
                        label='סינון לפי סטטוס'
                        {...params}
                    />
                }
                renderOption={(option, { selected }) => (
                    <>
                        <Checkbox
                            size='small'
                            className={classes.optionCheckbox}
                            checked={selected}
                            color='primary'
                        />
                        <Typography className={classes.option} >{option.displayName}</Typography>
                    </>
                )}
                limitTags={1}
            />
            <Checkbox
                onChange={(event) => changeUnassginedUserFilter(event.target.checked)}
                color='primary'
                checked={unassignedUserFilter}
            />
            <Typography className={classes.title} >
                חקירות לא משויכות
            </Typography>
            <Checkbox
                onChange={(event) => changeInactiveUserFilter(event.target.checked)}
                color='primary'
                checked={inactiveUserFilter}
            />
            <Typography className={classes.title} >
                חקירות משויכות לחוקרים לא פעילים
            </Typography>
            <IconButton onClick={() => onClose()} size='small'><Close /></IconButton>
        </Card>
    )
}

interface Props {
    statuses: InvestigationMainStatus[];
    filteredStatuses: StatusFilterType;
    unassignedUserFilter: boolean;
    inactiveUserFilter: boolean;
    changeUnassginedUserFilter: (isFilterOn: boolean) => void;
    changeInactiveUserFilter: (isFilterOn: boolean) => void;
    onFilterChange: (event: React.ChangeEvent<{}>, selectedStatuses: InvestigationMainStatus[]) => void;
    onClose: () => void;
    timeRangeFilter: TimeRange;
    onTimeRangeFilterChange: (timeRangeFilter: TimeRange) => void;
};

export default TableFilter
