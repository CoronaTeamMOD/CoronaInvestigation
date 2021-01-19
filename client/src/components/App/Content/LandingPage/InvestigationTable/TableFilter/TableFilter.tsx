import React from 'react'
import { Close } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { Card, Checkbox, Collapse, FormControl, Grid, IconButton, TextField, Typography } from '@material-ui/core';

import { TimeRange } from 'models/TimeRange';
import timeRanges, { customTimeRange, timeRangeMinDate } from 'models/enums/timeRanges';
import DateRangePick from 'commons/DatePick/DateRangePick';
import SelectDropdown from 'commons/Select/SelectDropdown';
import InvestigationSubStatus from 'models/InvestigationSubStatus';
import InvestigationMainStatus from 'models/InvestigationMainStatus';

import useStyles from './TableFilterStyles';
import useTableFilter from './useTableFilter';
import { StatusFilter as StatusFilterType, SubStatusFilter as SubStatusFilterType } from '../InvestigationTableInterfaces';

const TableFilter = (props: Props) => {

    const classes = useStyles();

    const { 
        statuses, subStatuses, filteredStatuses, filteredSubStatuses,
        onFilterChange, onClose, 
        changeInactiveUserFilter, onSubStatusChange, inactiveUserFilter, 
        changeUnassginedUserFilter, unassignedUserFilter, 
        timeRangeFilter, onTimeRangeFilterChange
    } = props;

    const { displayTimeRange, onSelectTimeRangeChange, onStartDateSelect, onEndDateSelect, errorMes} = useTableFilter({
        timeRangeFilter, 
        onTimeRangeFilterChange
    });

    return (
        <Card className={classes.card}>
            <Grid className={classes.startCard} xs={8}>
                <Typography className={classes.headTitle} >
                    <b>סינון לפי: </b>
                </Typography>
                <Typography className={classes.title}>
                    <b>ת. הגעת<br/> חקירה</b>
                </Typography>
                <FormControl variant='outlined' className={classes.formControl}>
                    <SelectDropdown
                        onChange={onSelectTimeRangeChange}
                        items={timeRanges}
                        value={displayTimeRange.id}
                    />
                </FormControl>
                <Collapse in={timeRangeFilter.id === customTimeRange.id} unmountOnExit classes={{container: classes.collapse}}>
                    <DateRangePick
                        startDate={displayTimeRange.startDate}
                        onStartDateChange={onStartDateSelect}
                        endDate={displayTimeRange.endDate}
                        onEndDateChange={onEndDateSelect}
                        minDate={timeRangeMinDate}
                        maxDate={new Date()}
                    />   
                </Collapse>
                {errorMes !== '' && 
                    <Typography className={classes.timeRangeError}>{errorMes}</Typography>
                }
                <Typography className={classes.title} >
                    <b>סטטוס</b>
                </Typography>
                <Autocomplete
                    ChipProps={{className:classes.chip}}
                    className={classes.autocomplete}
                    classes={{inputFocused: classes.autocompleteInputText}}
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
                            {...params}
                            InputProps={{...params.InputProps, className: classes.autocompleteInput}}
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
                <Typography className={classes.title} >
                    <b>תת סטטוס</b>
                </Typography>
                <Autocomplete
                    ChipProps={{className:classes.chip}}
                    className={classes.autocomplete}
                    classes={{inputFocused: classes.autocompleteInputText}}
                    size='small'
                    disableCloseOnSelect
                    multiple
                    options={subStatuses}
                    value={subStatuses.filter(subStatus => filteredSubStatuses.includes(subStatus.displayName))}
                    getOptionLabel={(option) => option.displayName}
                    onChange={onSubStatusChange}
                    renderInput={(params) =>
                        <TextField
                            size='small'
                            {...params}
                            InputProps={{...params.InputProps, className: classes.autocompleteInput}}
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
            </Grid>
            <Grid className={classes.endCard} xs={3}>
                <Checkbox
                    onChange={(event) => changeUnassginedUserFilter(event.target.checked)}
                    color='primary'
                    checked={unassignedUserFilter}
                />
                <Typography className={classes.title} >
                    <b>חקירות לא משויכות</b>
                </Typography>
                <Checkbox
                    onChange={(event) => changeInactiveUserFilter(event.target.checked)}
                    color='primary'
                    checked={inactiveUserFilter}
                />
                <Typography className={classes.title} >
                    <b>חקירות משויכות לחוקרים לא פעילים</b>
                </Typography>
                <IconButton onClick={() => onClose()} size='small'><Close /></IconButton>
            </Grid>   
        </Card>
    )
}

interface Props {
    statuses: InvestigationMainStatus[];
    subStatuses: InvestigationSubStatus[];
    filteredStatuses: StatusFilterType;
    filteredSubStatuses: SubStatusFilterType;
    unassignedUserFilter: boolean;
    inactiveUserFilter: boolean;
    changeUnassginedUserFilter: (isFilterOn: boolean) => void;
    changeInactiveUserFilter: (isFilterOn: boolean) => void;
    onFilterChange: (event: React.ChangeEvent<{}>, selectedStatuses: InvestigationMainStatus[]) => void;
    onSubStatusChange: (event: React.ChangeEvent<{}>, selectedSubStatuses: InvestigationSubStatus[]) => void;
    onClose: () => void;
    timeRangeFilter: TimeRange;
    onTimeRangeFilterChange: (timeRangeFilter: TimeRange) => void;
};

export default TableFilter
