import React, { useEffect, useState } from 'react'
import { Autocomplete } from '@material-ui/lab';
import { Card, Checkbox, Collapse, FormControl, Grid, Box, TextField, Typography } from '@material-ui/core';

import Desk from 'models/Desk';
import SubStatus from 'models/SubStatus';
import { TimeRange } from 'models/TimeRange';
import SearchBar from 'commons/SearchBar/SearchBar';
import DateRangePick from 'commons/DatePick/DateRangePick';
import SelectDropdown from 'commons/Select/SelectDropdown';
import InvestigationMainStatus from 'models/InvestigationMainStatus';
import InvestigationMainStatusCodes from 'models/enums/InvestigationMainStatusCodes';
import { stringAlphanum } from 'commons/AlphanumericTextField/AlphanumericTextField';
import timeRanges, { customTimeRange, timeRangeMinDate } from 'models/enums/timeRanges';

import useStyles from './TableFilterStyles';
import useTableFilter from './useTableFilter';
import DeskFilter from '../DeskFilter/DeskFilter';
import { StatusFilter as StatusFilterType, SubStatusFilter as SubStatusFilterType } from '../InvestigationTableInterfaces';
import { useDispatch, useSelector } from 'react-redux';
import KeyValuePair from 'models/KeyValuePair';
import StoreStateType from 'redux/storeStateType';
import { fetchAllInvestigatorReferenceStatuses, fetchAllChatStatuses } from 'httpClient/investigationInfo';
import { setInvestigatorReferenceStatuses } from 'redux/investigatorReferenceStatuses/investigatorReferenceStatusesActionCreator';
import { setChatStatuses } from 'redux/ChatStatuses/chatStatusesActionCreator';

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
        desksToTransfer, deskFilter, changeDeskFilter, changeSearchFilter,
        unallocatedDeskFilter, changeUnallocatedDeskFilter,
        changeInvestigatorReferenceStatusFilter, changeInvestigatorReferenceRequiredFilter,
        investigatorReferenceRequiredFilter, investigatorReferenceStatusFilter,
        chatStatusFilter, changeChatStatusFilter
    } = props;

    const { displayTimeRange, onSelectTimeRangeChange, onStartDateSelect, onEndDateSelect, errorMes } = useTableFilter({
        timeRangeFilter,
        onTimeRangeFilterChange
    });

    const dispatch = useDispatch();
    const investigatorReferenceStatuses = useSelector<StoreStateType, KeyValuePair[]>(state => state.investigatorReferenceStatuses);
    const chatStatuses = useSelector<StoreStateType, KeyValuePair[]>(state => state.chatStatuses);

    const [subStatusFiltered, setSubStatusFiltered] = useState<SubStatus[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<InvestigationMainStatusCodes[]>(filteredStatuses);
    const [selectedSubStatuses, setSelectedSubStatuses] = useState<string[]>(filteredSubStatuses);
    const [selectedInvestigatorReferenceStatus, setSelectedInvestigatorReferenceStatus] = useState<number[]>([]);
    const [selectedChatStatus, setSelectedChatStatus] = useState<number[]>([]);

    const isCustomTimeRange = timeRangeFilter.id === customTimeRange.id;


    useEffect(() => {
        if (investigatorReferenceStatuses.length === 0) {
            fetchAllInvestigatorReferenceStatuses().then(data => {
                if (data) dispatch(setInvestigatorReferenceStatuses(data));
            });
        }
        if (chatStatuses.length === 0) {
            fetchAllChatStatuses().then(data => {
                if (data) dispatch(setChatStatuses(data));
            });
        }
    }, []);

    useEffect(() => {
        selectedStatuses.length > 0
            ? setSubStatusFiltered(subStatuses.filter(subStatus => selectedStatuses.includes(subStatus.parentStatus)))
            : setSubStatusFiltered(subStatuses)
    }, [subStatuses, selectedSubStatuses, filteredStatuses, selectedStatuses]);

    useEffect(() => {
        filteredSubStatuses.length > 0
            ? setSelectedStatuses([...selectedStatuses, ...subStatuses.filter(subStatus => filteredSubStatuses.includes(subStatus.displayName)).map(subStatus => subStatus.parentStatus)])
            : setSelectedStatuses(filteredStatuses)
    }, [filteredSubStatuses, subStatuses]);

    return (
        <Card  className={classes.card}>
            <div className={classes.mainLine}>
                <Grid className={classes.startCard}>
                    <DeskFilter
                        desks={desksToTransfer}
                        filteredDesks={deskFilter}
                        onFilterChange={(event, value) => changeDeskFilter(value)}
                    />
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
                    disabled={nonContactFilter}
                    ChipProps={{ className: classes.chip }}
                    className={classes.autocomplete}
                    classes={{ inputFocused: classes.autocompleteInputText }}
                    size='small'
                    disableCloseOnSelect
                    multiple
                    options={statuses}
                    value={statuses.filter(status => selectedStatuses.includes(status.id))}
                    getOptionLabel={(option) => option.displayName}
                    onChange={(event, values) => {
                        onFilterChange(values);
                        setSelectedStatuses(values.map(value => value.id));
                    }}
                    renderInput={(params) =>
                        <TextField
                            label={'סטטוס'}
                            size='small'
                            {...params}
                            InputProps={{ ...params.InputProps, className: classes.autocompleteInput }}
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
                    ChipProps={{ className: classes.chip }}
                    className={classes.autocomplete}
                    classes={{ inputFocused: classes.autocompleteInputText }}
                    size='small'
                    disableCloseOnSelect
                    multiple
                    options={subStatusFiltered}
                    value={subStatusFiltered.filter(subStatus => selectedSubStatuses.includes(subStatus.displayName))}
                    getOptionLabel={(option) => option.displayName}
                    onChange={(event, values) => {
                        onSubStatusChange(values);
                        setSelectedSubStatuses(values.map(value => value.displayName));
                        values.length > 0
                            ? setSelectedStatuses([...selectedStatuses, ...statuses.filter(status => values.map(subStatus => subStatus.parentStatus).includes(status.id)).map(status => status.id)])
                            : setSelectedStatuses(filteredStatuses)

                    }}
                    renderInput={(params) =>
                        <TextField
                            label={'תת סטטוס'}
                            size='small'
                            {...params}
                            InputProps={{ ...params.InputProps, className: classes.autocompleteInput }}
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
                        ChipProps={{ className: classes.chip }}
                        className={classes.autocomplete}
                        classes={{ inputFocused: classes.autocompleteInputText }}
                        size='small'
                        disableCloseOnSelect
                        multiple
                        options={chatStatuses}
                        value={chatStatuses.filter(status => selectedChatStatus.includes(status.id))}
                        getOptionLabel={(option) => option.displayName}
                        onChange={(event, values) => {
                            changeChatStatusFilter(values);
                            setSelectedChatStatus(values.map(value => value.id));

                        }}
                        renderInput={(params) =>
                            <TextField
                                label={'סטטוס שיחת בוט'}
                                {...params}
                                InputProps={{ ...params.InputProps, className: classes.autocompleteInput }}
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
                        ChipProps={{ className: classes.chip }}
                        className={classes.autocomplete}
                        classes={{ inputFocused: classes.autocompleteInputText }}
                        size='small'
                        disableCloseOnSelect
                        multiple
                        options={investigatorReferenceStatuses}
                        value={investigatorReferenceStatuses.filter(status => selectedInvestigatorReferenceStatus.includes(status.id))}
                        getOptionLabel={(option) => option.displayName}
                        onChange={(event, values) => {
                            changeInvestigatorReferenceStatusFilter(values);
                            setSelectedInvestigatorReferenceStatus(values.map(value => value.id));

                        }}
                        renderInput={(params) =>
                            <TextField
                                label={'סטטוס טיפול חקירת בוט'}
                                {...params}
                                InputProps={{ ...params.InputProps, className: classes.autocompleteInput }}
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
                <Grid className={classes.endCard} xs={3} direction='column'>
                    <div className={classes.row}>
                        <Checkbox
                            onChange={(event) => changeUnassginedUserFilter(event.target.checked)}
                            color='primary'
                            checked={unassignedUserFilter}
                            className={classes.checkbox}
                        />
                        <Typography className={classes.title}>לא משויכות לחוקר</Typography>
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
                    <div className={classes.row}>
                        <Checkbox
                            onChange={(event) => changeUnallocatedDeskFilter(event.target.checked)}
                            color='primary'
                            checked={unallocatedDeskFilter}
                            className={classes.checkbox}
                        />
                        <Typography className={classes.title}>לא משויכות לדסק</Typography>
                    </div>
                    <div className={classes.row}>
                        <Checkbox
                            onChange={(event) => changeInvestigatorReferenceRequiredFilter(event.target.checked)}
                            color='primary'
                            checked={investigatorReferenceRequiredFilter}
                            className={classes.checkbox}
                        />
                        <Typography className={classes.title}>נדרשת התייחסות חוקר</Typography>
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
    investigatorReferenceRequiredFilter: boolean;
    investigatorReferenceStatusFilter: number[];
    chatStatusFilter: number[];
    changeUnassginedUserFilter: (isFilterOn: boolean) => void;
    changeInactiveUserFilter: (isFilterOn: boolean) => void;
    onFilterChange: (selectedStatuses: InvestigationMainStatus[]) => void;
    onSubStatusChange: (selectedSubStatuses: SubStatus[]) => void;
    timeRangeFilter: TimeRange;
    onTimeRangeFilterChange: (timeRangeFilter: TimeRange) => void;
    updateDateFilter: string;
    nonContactFilter: boolean;
    desksToTransfer: Desk[];
    deskFilter: (number | null)[];
    changeDeskFilter: (desks: Desk[]) => void;
    handleRequestSort: (event: any, property: React.SetStateAction<string>) => void;
    changeSearchFilter: (searchQuery: string) => void;
    unallocatedDeskFilter: boolean;
    changeUnallocatedDeskFilter: (isFilterOn: boolean) => void;
    changeChatStatusFilter: (statuses: KeyValuePair[]) => void;
    changeInvestigatorReferenceStatusFilter: (statuses: KeyValuePair[]) => void;
    changeInvestigatorReferenceRequiredFilter: (isFilterOn: boolean) => void;

};

export default TableFilter
