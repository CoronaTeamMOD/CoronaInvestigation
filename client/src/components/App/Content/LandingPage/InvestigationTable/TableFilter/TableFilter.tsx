import React, { useMemo, useState } from 'react'
import { Autocomplete } from '@material-ui/lab';
import { Card, Checkbox, Collapse, FormControl, Grid, Box, TextField, Typography } from '@material-ui/core';

import Desk from 'models/Desk';
import SubStatus from 'models/SubStatus';
import { TimeRange } from 'models/TimeRange';
import SearchBar from 'commons/SearchBar/SearchBar';
import DateRangePick from 'commons/DatePick/DateRangePick';
import SelectDropdown from 'commons/Select/SelectDropdown';
import InvestigationMainStatus from 'models/InvestigationMainStatus';
import { stringAlphanum } from 'commons/AlphanumericTextField/AlphanumericTextField';
import InvestigationMainStatusCodes from 'models/enums/InvestigationMainStatusCodes';
import timeRanges, { customTimeRange, timeRangeMinDate } from 'models/enums/timeRanges';

import useStyles from './TableFilterStyles';
import useTableFilter from './useTableFilter';
import DeskFilter from '../DeskFilter/DeskFilter';
import { StatusFilter as StatusFilterType, SubStatusFilter as SubStatusFilterType } from '../InvestigationTableInterfaces';

const searchBarLabel = 'מספר אפידמיולוגי, ת"ז, שם או טלפון';

const TableFilter = (props: Props) => {

    const classes = useStyles();

    const { 
        statuses, subStatuses, filteredStatuses, filteredSubStatuses,
        onFilterChange, 
        changeInactiveUserFilter, onSubStatusChange, inactiveUserFilter, 
        changeUnassginedUserFilter, unassignedUserFilter, 
        timeRangeFilter, onTimeRangeFilterChange, 
        updateDateFilter, nonContactFilter,
        desksToTransfer, deskFilter, changeDeskFilter, changeSearchFilter
    } = props;

    const { displayTimeRange, onSelectTimeRangeChange, onStartDateSelect, onEndDateSelect, errorMes} = useTableFilter({
        timeRangeFilter, 
        onTimeRangeFilterChange
    });

    const [statusesId, setStatusesIds] = useState([]);
    const isCustomTimeRange = timeRangeFilter.id === customTimeRange.id


    // const updatedSubStatuses = useMemo(() =>
    //     status === InvestigationMainStatusCodes.IN_PROCESS ? [inProcess , ...subStatuses] : subStatuses,
    //     [subStatuses, status]);


    return (
        <Card className={classes.card}>
            <Grid className={classes.startCard}>
                <DeskFilter
                    desks={desksToTransfer}
                    filteredDesks={deskFilter}
                    onFilterChange={(event, value) => changeDeskFilter(value)} 
                />
            </Grid>
            <div className={classes.column}>
                <FormControl variant='outlined' className={isCustomTimeRange ? classes.formControlCustomTimeRange : classes.formControl}>
                    <SelectDropdown
                        onChange={onSelectTimeRangeChange}
                        items={timeRanges}
                        value={displayTimeRange.id}
                    />
                </FormControl>
                <Collapse in={isCustomTimeRange} unmountOnExit>
                    <DateRangePick
                        startDate={displayTimeRange.startDate}
                        onStartDateChange={onStartDateSelect}
                        endDate={displayTimeRange.endDate}
                        onEndDateChange={onEndDateSelect}
                        minDate={timeRangeMinDate}
                        maxDate={new Date()}
                    />   
                </Collapse>
            </div>
            {errorMes !== '' && 
                <Typography className={classes.timeRangeError}>{errorMes}</Typography>
            }
            <Autocomplete
                disabled={updateDateFilter !== "" || nonContactFilter}
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
                        label={'סטטוס'}
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
            <Autocomplete
                disabled={updateDateFilter !== ""}
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
                        label={'תת סטטוס'}
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
            <Grid className={classes.endCard} xs={3} direction='column'>
                <div className={classes.row}>
                    <Checkbox
                        onChange={(event) => changeUnassginedUserFilter(event.target.checked)}
                        color='primary'
                        checked={unassignedUserFilter}
                        className={classes.checkbox}
                    />
                    <Typography className={classes.title}>לא משויכות</Typography>
                </div>
                <div className={classes.row}>
                    <Checkbox
                        onChange={(event) => changeInactiveUserFilter(event.target.checked)}
                        color='primary'
                        checked={inactiveUserFilter}
                        className={classes.checkbox}
                    />
                    <Typography className={classes.title}>משויכות לחוקרים לא פעילים</Typography>
                </div>
            </Grid>
            <div className={classes.tableHeaderRow}>
                <Box justifyContent='flex-end' display='flex'>
                    <SearchBar 
                        validationSchema={stringAlphanum}
                        searchBarLabel={searchBarLabel}
                        onClick={(value: string) => changeSearchFilter(value)}
                    />
                    
                </Box>
            </div> 
        </Card>
    )
}

interface Props {
    statuses: InvestigationMainStatus[];
    subStatuses: SubStatus[];
    filteredStatuses: StatusFilterType;
    filteredSubStatuses: SubStatusFilterType;
    unassignedUserFilter: boolean;
    inactiveUserFilter: boolean;
    changeUnassginedUserFilter: (isFilterOn: boolean) => void;
    changeInactiveUserFilter: (isFilterOn: boolean) => void;
    onFilterChange: (event: React.ChangeEvent<{}>, selectedStatuses: InvestigationMainStatus[]) => void;
    onSubStatusChange: (event: React.ChangeEvent<{}>, selectedSubStatuses: SubStatus[]) => void;
    timeRangeFilter: TimeRange;
    onTimeRangeFilterChange: (timeRangeFilter: TimeRange) => void;
    updateDateFilter: string;
    nonContactFilter: boolean;
    desksToTransfer: Desk[];
    deskFilter: any;
    changeDeskFilter: (desks: Desk[]) => void;
    handleRequestSort: (event: any, property: React.SetStateAction<string>) => void;
    changeSearchFilter: (searchQuery: string) => void;
};

export default TableFilter
