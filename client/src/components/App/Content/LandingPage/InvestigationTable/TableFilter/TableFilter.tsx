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
import ComplexityReason from 'models/ComplexityReason';

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
        changeInvestigatorReferenceStatusFilter, changeNotSentToBotFilter,
        notSentToBotFilter, investigatorReferenceStatusFilter,
        chatStatusFilter, changeChatStatusFilter,
        incompletedBotInvestigationFilter, changeIncompletedBotInvestigationFilter,
        complexityFilter, changeComplexityFilter,
        complexityReasonFilter, changeComplexityReasonFilter
    } = props;

    const { displayTimeRange, onSelectTimeRangeChange, onStartDateSelect, onEndDateSelect, errorMes } = useTableFilter({
        timeRangeFilter,
        onTimeRangeFilterChange
    });

    const investigatorReferenceStatuses = useSelector<StoreStateType, KeyValuePair[]>(state => state.investigatorReferenceStatuses);
    const chatStatuses = useSelector<StoreStateType, KeyValuePair[]>(state => state.chatStatuses);
    const complexityReasons = useSelector<StoreStateType, ComplexityReason[]>(state=>state.complexityReasons);

    const [subStatusFiltered, setSubStatusFiltered] = useState<SubStatus[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<InvestigationMainStatusCodes[]>(filteredStatuses);
    const [selectedSubStatuses, setSelectedSubStatuses] = useState<string[]>(filteredSubStatuses);
    const [selectedInvestigatorReferenceStatus, setSelectedInvestigatorReferenceStatus] = useState<number[]>(investigatorReferenceStatusFilter);
    const [selectedChatStatus, setSelectedChatStatus] = useState<number[]>(chatStatusFilter);
    const [selectedComplexityReason,setSelectedComplexityReason] = useState<number[]>(complexityReasonFilter);
    const isCustomTimeRange = timeRangeFilter.id === customTimeRange.id;

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
        <Card className={classes.card}>
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
                    { 
                    complexityFilter &&
                        <Autocomplete
                        ChipProps={{ className: classes.chip }}
                        className={classes.autocomplete}
                        classes={{ inputFocused: classes.autocompleteInputText }}
                        size='small'
                        disableCloseOnSelect
                        multiple
                        options={complexityReasons}
                        value={complexityReasons.filter(reason => selectedComplexityReason.includes(reason.reasonId))}
                        getOptionLabel={(option) => option.description}
                        onChange={(event, values) => {
                            changeComplexityReasonFilter(values);
                            setSelectedComplexityReason(values.map(value => value.reasonId));

                        }}
                        renderInput={(params) =>
                            <TextField
                                label={'סיבה למורכבות חקירה'}
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
                                <Typography className={classes.option} >{option.description}</Typography>
                            </>
                        )}
                        limitTags={1}
                    />
                    }
                </Grid>
                <Grid className={classes.endCard} xs={7}>
                    <div className={classes.row}>
                        <div>
                            <Checkbox
                                onChange={(event) => changeUnassginedUserFilter(event.target.checked)}
                                color='primary'
                                checked={unassignedUserFilter}
                                className={classes.checkbox}
                            />
                            <Typography className={classes.title}>לא משויכות לחוקר</Typography>
                        </div>
                        <div>
                            <Checkbox
                                onChange={(event) => changeInactiveUserFilter(event.target.checked)}
                                color='primary'
                                checked={inactiveUserFilter}
                                className={classes.checkbox}
                            />
                            <Typography className={classes.title}>משויכות לחוקרים לא פעילים</Typography>
                        </div>
                        <div>
                            <Checkbox
                                onChange={(event) => changeUnallocatedDeskFilter(event.target.checked)}
                                color='primary'
                                checked={unallocatedDeskFilter}
                                className={classes.checkbox}
                            />
                            <Typography className={classes.title}>לא משויכות לדסק</Typography>
                        </div>
                    </div>
                    <div className={classes.row}>
                        <div>
                            <Checkbox
                                onChange={(event) => changeNotSentToBotFilter(event.target.checked)}
                                color='primary'
                                checked={notSentToBotFilter}
                                className={classes.checkbox}
                            />
                            <Typography className={classes.title}>חקירות שלא נשלחו לבוט</Typography>
                        </div>
                        <div>
                            <Checkbox
                                onChange={(event) => changeIncompletedBotInvestigationFilter(event.target.checked)}
                                color='primary'
                                checked={incompletedBotInvestigationFilter}
                                className={classes.checkbox}
                            />
                            <Typography className={classes.title}>חקירות שלא הושלמו ע"י בוט</Typography>
                        </div>
                        <div>
                            <Checkbox
                                onChange={(event) => changeComplexityFilter(event.target.checked)}
                                color='primary'
                                checked={complexityFilter}
                                className={classes.checkbox}
                            />
                            <Typography className={classes.title}>חקירות מורכבות</Typography>
                        </div>
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
    notSentToBotFilter: boolean;
    investigatorReferenceStatusFilter: number[];
    chatStatusFilter: number[];
    incompletedBotInvestigationFilter: boolean;
    complexityFilter: boolean;
    complexityReasonFilter: number[];
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
    changeNotSentToBotFilter: (isFilterOn: boolean) => void;
    changeIncompletedBotInvestigationFilter: (isFilterOn: boolean) => void;
    changeComplexityFilter: (isFilterOn: boolean) => void;
    changeComplexityReasonFilter : (complexityReasons : ComplexityReason[]) =>void;
};

export default TableFilter
