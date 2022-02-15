import React, { useEffect, useState } from 'react'
import { Autocomplete } from '@material-ui/lab';
import { Card, Checkbox, Collapse, FormControl, Grid, Box, TextField, Typography, Input, Button, Link } from '@material-ui/core';
import { ExpandMoreRounded, ExpandLessRounded, Filter } from '@material-ui/icons';

import Desk from 'models/Desk';
import SubStatus from 'models/SubStatus';
import { TimeRange } from 'models/TimeRange';
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
import ageRange, { AgeRangeCodes } from 'models/enums/AgeRange';
import { AgeRange } from 'models/AgeRange';
import AgeRangeFields from 'commons/AgeRange/AgeRangeFields';
import FilterTableSearchBar from 'commons/SearchBar/FilterTableSearchBar';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';

const searchBarLabel = 'מספר אפידמיולוגי, ת"ז, שם או טלפון';

const TableFilter = (props: Props) => {

    const classes = useStyles();
    const { alertError } = useCustomSwal();

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
        complexityReasonFilter, changeComplexityReasonFilter,
        ageFilter, changeAgeFilter,
        onFilterButtonClicked, onResetButtonClicked, filterTitle
    } = props;

    const {
        displayTimeRange,
        onSelectTimeRangeChange,
        onStartDateSelect,
        onEndDateSelect,
        errorMes,
        selectedAgeOption,
        onAgeRangeChange,
        onMinAgeChanged,
        onMaxAgeChanged,
        ageErrMsg,
        resetTimeRange,
        resetAgeRange,
    } = useTableFilter({
        timeRangeFilter,
        onTimeRangeFilterChange,
        ageFilter,
        changeAgeFilter
    });

    const investigatorReferenceStatuses = useSelector<StoreStateType, KeyValuePair[]>(state => state.investigatorReferenceStatuses);
    const chatStatuses = useSelector<StoreStateType, KeyValuePair[]>(state => state.chatStatuses);
    const complexityReasons = useSelector<StoreStateType, ComplexityReason[]>(state => state.complexityReasons);

    const [subStatusFiltered, setSubStatusFiltered] = useState<SubStatus[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<InvestigationMainStatusCodes[]>(filteredStatuses);
    const [selectedSubStatuses, setSelectedSubStatuses] = useState<string[]>(filteredSubStatuses);
    const [selectedInvestigatorReferenceStatus, setSelectedInvestigatorReferenceStatus] = useState<number[]>(investigatorReferenceStatusFilter);
    const [selectedChatStatus, setSelectedChatStatus] = useState<number[]>(chatStatusFilter);
    const [selectedComplexityReason, setSelectedComplexityReason] = useState<number[]>(complexityReasonFilter);
    const isCustomTimeRange = timeRangeFilter.id === customTimeRange.id;
    const [expanded, setExpanded] = React.useState(false);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const resetFilter = () => {
        changeSearchFilter('');
        setSearchQuery('');
        changeDeskFilter([]);
        resetTimeRange();
        onFilterChange([]);
        setSelectedStatuses([]);
        onSubStatusChange([]);
        setSelectedSubStatuses([]);
        changeChatStatusFilter([]);
        setSelectedChatStatus([]);
        changeInvestigatorReferenceStatusFilter([]);
        setSelectedInvestigatorReferenceStatus([]);
        resetAgeRange();
        changeUnassginedUserFilter(false);
        changeInactiveUserFilter(false);
        changeUnallocatedDeskFilter(false);
        changeIncompletedBotInvestigationFilter(false);
        changeNotSentToBotFilter(false);
        changeComplexityFilter(false);
        changeComplexityReasonFilter([]);
        setSelectedComplexityReason([]);
        onResetButtonClicked();
    }

    const filter = () => {
        if (ageErrMsg != '' || errorMes != '') {
            alertError('יש שגיאות בדף, לא ניתן לבצע סינון');
        }
        else {
            onFilterButtonClicked()
        }

    }

    const onSearchIconClicked = () => {
        filter();
    }

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

    useEffect(() => {

    },[])

    return (
            <Card className={classes.card}>
                <Grid container alignItems='center'>
                    <Grid item md={9}>
                        <Typography className={classes.filterTitle}>סינון חקירות
                            {!expanded && filterTitle != '' &&
                                <span> | </span>
                            }
                            {!expanded &&
                                <span className={classes.filterSubTitle}>{filterTitle}</span>
                            }
                        </Typography>
                    </Grid>
                    <Grid item md={3} >
                        <Box justifyContent='flex-end' display='flex'>
                            <FilterTableSearchBar
                                validationSchema={stringAlphanum}
                                searchBarLabel={searchBarLabel}
                                onClick={() => onSearchIconClicked()}
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                changeSearchFilter={changeSearchFilter}
                            />
                        </Box>
                    </Grid>
                    <Collapse className={classes.collapse} in={expanded} timeout="auto" unmountOnExit>
                        <Grid item md={12} className={classes.mainLine} >
                            <Grid item md='auto'>
                                <Checkbox
                                    onChange={(event) => changeUnassginedUserFilter(event.target.checked)}
                                    color='primary'
                                    checked={unassignedUserFilter}
                                    className={classes.checkbox}
                                />
                                <Typography className={classes.title}>לא משויכות לחוקר</Typography>
                            </Grid>
                            <Grid item md='auto'>
                                <Checkbox
                                    onChange={(event) => changeInactiveUserFilter(event.target.checked)}
                                    color='primary'
                                    checked={inactiveUserFilter}
                                    className={classes.checkbox}
                                />
                                <Typography className={classes.title}>משויכות לחוקרים לא פעילים</Typography>
                            </Grid>
                            <Grid item md='auto'>
                                <Checkbox
                                    onChange={(event) => changeUnallocatedDeskFilter(event.target.checked)}
                                    color='primary'
                                    checked={unallocatedDeskFilter}
                                    className={classes.checkbox}
                                />
                                <Typography className={classes.title}>לא משויכות לדסק</Typography>
                            </Grid>
                            <Grid item md='auto'>
                                <Checkbox
                                    onChange={(event) => changeNotSentToBotFilter(event.target.checked)}
                                    color='primary'
                                    checked={notSentToBotFilter}
                                    className={classes.checkbox}
                                />
                                <Typography className={classes.title}>חקירות שלא נשלחו לבוט</Typography>
                            </Grid>
                            <Grid item md='auto'>
                                <Checkbox
                                    onChange={(event) => changeIncompletedBotInvestigationFilter(event.target.checked)}
                                    color='primary'
                                    checked={incompletedBotInvestigationFilter}
                                    className={classes.checkbox}
                                />
                                <Typography className={classes.title}>חקירות שלא הושלמו ע"י בוט</Typography>
                            </Grid>
                            <Grid item md='auto'>
                                <Checkbox
                                    onChange={(event) => changeComplexityFilter(event.target.checked)}
                                    color='primary'
                                    checked={complexityFilter}
                                    className={classes.checkbox}
                                />
                                <Typography className={classes.title}>חקירות מורכבות</Typography>
                            </Grid>
                            {
                                complexityFilter &&
                                <Grid item md='auto'>
                                    <Autocomplete
                                        ChipProps={{ className: classes.chip }}
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
                                </Grid>
                            }
                        </Grid>
                        <Grid item md={12} className={classes.mainLine} >
                            <Grid item md={1} className={classes.column}>
                                <DeskFilter
                                    desks={desksToTransfer}
                                    filteredDesks={deskFilter}
                                    onFilterChange={(event, value) => changeDeskFilter(value)}
                                />
                            </Grid>
                            <Grid item md={1}>
                                <FormControl variant='outlined' className={classes.selectDropdown}>
                                    <SelectDropdown
                                        onChange={onSelectTimeRangeChange}
                                        items={timeRanges}
                                        value={displayTimeRange.id}
                                    />
                                </FormControl>
                            </Grid>
                            {isCustomTimeRange &&
                                <Grid item md={2}>
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
                                </Grid>
                            }
                            <Grid item md={1}>
                                <Autocomplete
                                    disabled={nonContactFilter}
                                    ChipProps={{ className: classes.chip }}
                                    classes={{ inputFocused: classes.autocompleteInputText }}
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
                            <Grid item md={1}>
                                <Autocomplete
                                    ChipProps={{ className: classes.chip }}
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
                            <Grid item md={1}>
                                <Autocomplete
                                    ChipProps={{ className: classes.chip }}
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
                            </Grid>
                            <Grid item md='auto'>
                                <Autocomplete
                                    ChipProps={{ className: classes.chip }}
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
                                            label={'סטטוס התיחסות חוקר'}
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
                            <Grid item md={1}>
                                <FormControl variant='outlined' className={classes.selectDropdown}>
                                    <SelectDropdown
                                        onChange={onAgeRangeChange}
                                        items={ageRange}
                                        value={selectedAgeOption.id}
                                    />
                                </FormControl>
                            </Grid>
                            {selectedAgeOption.id === AgeRangeCodes.RANGE &&
                                <Grid item md={1}>
                                    <AgeRangeFields
                                        minAge={selectedAgeOption.ageFrom}
                                        maxAge={selectedAgeOption.ageTo}
                                        minAgeChanged={onMinAgeChanged}
                                        maxAgeChanged={onMaxAgeChanged}
                                    />
                                    {ageErrMsg !== '' &&
                                        <Typography className={classes.timeRangeError}>{ageErrMsg}</Typography>
                                    }
                                </Grid>
                            }


                        </Grid>
                        <Grid item md='auto'>
                            <Box justifyContent='flex-end' display='flex'>
                                <Link component='button' className={classes.resetLinkButton} onClick={resetFilter} >   נקה סינון </Link>
                                <Button className={classes.filterButton} variant='contained' onClick={filter} ><i className={'moh-icon filter ' + classes.filterIconButton}></i> סנן </Button>
                            </Box>
                        </Grid>

                    </Collapse>
                </Grid>
                <Box display='flex' justifyContent='center' alignSelf='flex-end' >
                    <i className={'moh-icon Next ' + classes.expandIconButton} onClick={handleExpandClick}>
                        {expanded && <ExpandLessRounded className={classes.expandIcon} />}
                        {!expanded && <ExpandMoreRounded className={classes.expandIcon} />}</i>
                </Box>
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
    ageFilter: AgeRange;
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
    changeComplexityReasonFilter: (complexityReasons: ComplexityReason[]) => void;
    changeAgeFilter: (ageFilter: AgeRange) => void;
    onFilterButtonClicked: () => void;
    onResetButtonClicked: () => void;
    filterTitle: string;
};

export default TableFilter
