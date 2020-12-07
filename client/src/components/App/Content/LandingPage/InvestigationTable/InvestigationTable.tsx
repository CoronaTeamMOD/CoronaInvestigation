import { useSelector } from 'react-redux';
import React, { useMemo, useState, useRef } from 'react';
import { Autocomplete, Pagination } from '@material-ui/lab';
import {
    Paper, Table, TableRow, TableBody, TableCell, Typography,
    TableHead, TableContainer, TextField, TableSortLabel, Button, Popper,
    useMediaQuery, Tooltip, Card, Collapse, IconButton, Badge, Grid, Checkbox,
    Slide, Box, InputAdornment
} from '@material-ui/core';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Refresh, Warning, Close, KeyboardArrowDown, KeyboardArrowLeft, Search } from '@material-ui/icons';

import Desk from 'models/Desk';
import User from 'models/User';
import County from 'models/County';
import userType from 'models/enums/UserType';
import Investigator from 'models/Investigator';
import SortOrder from 'models/enums/SortOrder';
import StoreStateType from 'redux/storeStateType';
import InvestigatorOption from 'models/InvestigatorOption';
import InvestigationTableRow from 'models/InvestigationTableRow';
import RefreshSnackbar from 'commons/RefreshSnackbar/RefreshSnackbar';
import InvestigationMainStatus from 'models/enums/InvestigationMainStatus';
import InvestigationsFilterByFields from 'models/enums/InvestigationsFilterByFields';
import ComplexityIcon from 'commons/InvestigationComplexity/ComplexityIcon/ComplexityIcon';
import { stringAlphanum } from 'commons/AlphanumericTextField/AlphanumericTextField';
import { phoneAndIdentityNumberRegex } from '../../InvestigationForm/TabManagement/ExposuresAndFlights/ExposureForm/ExposureForm'

import filterCreators from './FilterCreators';
import useStyles from './InvestigationTableStyles';
import CommentDisplay from './commentDisplay/commentDisplay';
import SettingsActions from './SettingsActions/SettingsActions';
import InvestigationTableFooter from './InvestigationTableFooter/InvestigationTableFooter';
import InvestigationStatusColumn from './InvestigationStatusColumn/InvestigationStatusColumn';
import InvestigationNumberColumn from './InvestigationNumberColumn/InvestigationNumberColumn';
import useInvestigationTable, { UNDEFINED_ROW, ALL_STATUSES_FILTER_OPTIONS } from './useInvestigationTable';
import { TableHeadersNames, TableHeaders, adminCols, userCols, Order, sortableCols } from './InvestigationTablesHeaders';

export const defaultOrderBy = 'defaultOrder';
export const defaultPage = 1;
const resetSortButtonText = 'סידור לפי תעדוף';
const welcomeMessage = 'היי, אלו הן החקירות שהוקצו לך היום. בואו נקטע את שרשראות ההדבקה!';
const noInvestigationsMessage = 'היי,אין חקירות לביצוע!';
const investigatorNameMsg = 'שם חוקר';
const newInvestigationsMsg = 'חקירות חדשות';
const activeInvestigationsMsg = 'חקירות בטיפול';
const hasNoSourceOrganization = 'לא שויך למסגרת';
const hasNoDesk = 'לא שויך לדסק';
const complexInvestigationMessage = 'חקירה מורכבת';
const noPriorityMessage = 'חסר תעדוף';
const searchBarLabel = 'הכנס מס\' אפידימיולוגי, ת\"ז, שם או טלפון...';
const searchBarError = 'יש להכניס רק אותיות ומספרים';

const defaultInvestigator = {
    id: '',
    countyId: 0,
    userName: ''
};

const defaultCounty = {
    id: 0,
    displayName: ''
}

export const rowsPerPage = 100;

const refreshPromptMessage = 'שים לב, ייתכן כי התווספו חקירות חדשות';
const unassignedToDesk = 'לא שוייך לדסק';
const showInvestigationGroupText = 'הצג חקירות קשורות';
const hideInvestigationGroupText = 'הסתר חקירות קשורות';

const InvestigationTable: React.FC = (): JSX.Element => {

    const isScreenWide = useMediaQuery('(min-width: 1680px)');
    const classes = useStyles(isScreenWide)();

    const [checkedRowsIds, setCheckedRowsIds] = useState<number[]>([]);
    const [selectedRow, setSelectedRow] = useState<number>(UNDEFINED_ROW);
    const [selectedInvestigator, setSelectedInvestigator] = useState<Investigator>(defaultInvestigator);
    const [investigatorAutoCompleteClicked, setInvestigatorAutoCompleteClicked] = useState<boolean>(false);
    const [countyAutoCompleteClicked, setCountyAutoCompleteClicked] = useState<boolean>(false);
    const [deskAutoCompleteClicked, setDeskAutoCompleteClicked] = useState<boolean>(false);
    const [currCounty, setCurrCounty] = useState<County>(defaultCounty);
    const [allUsersOfCurrCounty, setAllUsersOfCurrCounty] = useState<Map<string, User>>(new Map());
    const [allCounties, setAllCounties] = useState<Map<number, County>>(new Map());
    const [order, setOrder] = useState<Order>(SortOrder.asc);
    const [orderBy, setOrderBy] = useState<string>(defaultOrderBy);
    const [allStatuses, setAllStatuses] = useState<string[]>([]);
    const [showFilterRow, setShowFilterRow] = useState<boolean>(false);
    const [allDesks, setAllDesks] = useState<Desk[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(defaultPage);
    const [filterByStatuses, setFilterByStatuses] = useState<string[]>([]);
    const [filterByDesks, setFilterByDesks] = useState<Desk[]>([]);
    const [searchBarQuery, setSearchBarQuery] = useState<string>('');
    const [isSearchBarValid, setIsSearchBarValid] = useState<boolean>(true);
    const [checkGroupedInvestigationOpen, setCheckGroupedInvestigationOpen] = React.useState<number[]>([])
    const [allGroupedInvestigations, setAllGroupedInvestigations] = useState<Map<string, InvestigationTableRow[]>>(new Map());

    const closeDropdowns = () => {
        setInvestigatorAutoCompleteClicked(false);
        setCountyAutoCompleteClicked(false);
        setDeskAutoCompleteClicked(false);
    }

    const tableContainerRef = useRef<HTMLElement>();
    const investigationColor = useRef<Map<string, string>>(new Map())

    const {
        onCancel, onOk, snackbarOpen, tableRows, onInvestigationRowClick, convertToIndexedRow, getCountyMapKeyByValue,
        sortInvestigationTable, getUserMapKeyByValue, onInvestigatorChange, onCountyChange, onDeskChange, getTableCellStyles,
        moveToTheInvestigationForm, setTableRows, totalCount, handleFilterChange, unassignedInvestigationsCount,
        fetchInvestigationsByGroupId, fetchTableData
    } = useInvestigationTable({
        selectedInvestigator, setSelectedRow, setAllUsersOfCurrCounty, allGroupedInvestigations,
        setAllCounties, setAllStatuses, setAllDesks, checkedRowsIds, currentPage, setCurrentPage, setAllGroupedInvestigations, 
        investigationColor
    });

    const user = useSelector<StoreStateType, User>(state => state.user.data);

    const totalPageCount = Math.ceil(totalCount / rowsPerPage);

    const isRowSelected = (epidemiologyNumber: number) => checkedRowsIds.includes(epidemiologyNumber);

    const handleCellClick = (event: any, key: string, epidemiologyNumber: number) => {
        switch (key) {
            case TableHeadersNames.investigatorName: {
                event.stopPropagation();
                setInvestigatorAutoCompleteClicked(true);
                setCountyAutoCompleteClicked(false);
                setDeskAutoCompleteClicked(false);
                break;
            }
            case TableHeadersNames.county: {
                event.stopPropagation();
                setCountyAutoCompleteClicked(true);
                setInvestigatorAutoCompleteClicked(false);
                setDeskAutoCompleteClicked(false);
                break;
            }
            case TableHeadersNames.investigationDesk: {
                event.stopPropagation();
                setDeskAutoCompleteClicked(true);
                setInvestigatorAutoCompleteClicked(false);
                setCountyAutoCompleteClicked(false);
                break;
            }
        }
        setSelectedRow(epidemiologyNumber);
        setCheckedRowsIds([]);
    }

    const CustomPopper = (props: any) => {
        return (<Popper {...props} style={{ width: 350 }} placement='bottom-start' />)
    }

    const UnassignedWarning = () => (
        <Tooltip title='לא הוקצה חוקר לחקירה'>
            <Warning className={classes.warningIcon} />
        </Tooltip>
    )

    const getFilteredUsersOfCurrentCounty = (): InvestigatorOption[] => {
        const allUsersOfCountyArray = Array.from(allUsersOfCurrCounty, ([id, value]) => ({ id, value }));
        return filterByDesks.length === 0 ?
            allUsersOfCountyArray :
            allUsersOfCountyArray.filter(({ id, value }) => {
                if (!value.deskByDeskId) {
                    return false;
                }
                return filterByDesks.map((desk: Desk) => desk.id).includes(value.deskByDeskId.id);
            });
    }

    const getTableCell = (cellName: string, indexedRow: { [T in keyof typeof TableHeadersNames]: any }) => {
        const wasInvestigationFetchedByGroup = indexedRow.groupId && !indexedRow.canFetchGroup;
        switch (cellName) {
            case TableHeadersNames.epidemiologyNumber:
                return <InvestigationNumberColumn
                    wasInvestigationTransferred={indexedRow.wasInvestigationTransferred}
                    epidemiologyNumber={indexedRow.epidemiologyNumber}
                    transferReason={indexedRow.transferReason}
                />
            case TableHeadersNames.investigatorName:
                const isUnassigned = indexedRow.investigatorName === 'לא משויך';
                if (selectedRow === indexedRow.epidemiologyNumber && investigatorAutoCompleteClicked && !wasInvestigationFetchedByGroup) {
                    return (
                        <div className={classes.selectedInvestigator}>
                            {isUnassigned && <UnassignedWarning />}
                            <Autocomplete
                                PopperComponent={CustomPopper}
                                test-id='currentInvetigationUser'
                                options={getFilteredUsersOfCurrentCounty()}
                                getOptionLabel={(option) => option.value.userName}
                                renderOption={(option, { selected }) => (
                                    option.value ?
                                        <>
                                            <div className={classes.fullWidthDiv}>
                                                <Typography variant='body1' color='textSecondary' className={classes.userNameStyle}>
                                                    <a>
                                                        {investigatorNameMsg} :
                                                    <b>
                                                            {option.value.userName}
                                                        </b>
                                                        &nbsp;&nbsp;
                                                        {
                                                            (option.value.sourceOrganization || option.value.deskName) ?
                                                                `${option.value.sourceOrganization ? option.value.sourceOrganization : hasNoSourceOrganization},
                                                                ${option.value.deskByDeskId?.deskName ? option.value.deskByDeskId?.deskName : hasNoDesk}` : `${hasNoSourceOrganization}, ${hasNoDesk}`
                                                        }
                                                    </a>
                                                    <br></br>
                                                </Typography>
                                                <Typography variant='body1' color='textSecondary'>
                                                    <a>
                                                        {newInvestigationsMsg} :
                                                    <b>
                                                            {option.value.newInvestigationsCount}
                                                        </b>
                                                    </a>
                                                &nbsp;&nbsp;
                                                <a>
                                                        {activeInvestigationsMsg} :
                                                    <b>
                                                            {option.value.activeInvestigationsCount}
                                                        </b>
                                                    </a>
                                                </Typography>
                                            </div>
                                        </>
                                        :
                                        ''
                                )}
                                inputValue={selectedInvestigator.userName}
                                onChange={(event, newSelectedInvestigator) => {
                                    onInvestigatorChange(indexedRow, newSelectedInvestigator, indexedRow.investigatorName)
                                }}
                                onInputChange={(event, selectedInvestigatorName) => {
                                    if (event?.type !== 'blur') {
                                        const updatedInvestigator = {
                                            id: getUserMapKeyByValue(allUsersOfCurrCounty, selectedInvestigatorName),
                                            userName: selectedInvestigatorName
                                        }
                                        setSelectedInvestigator(updatedInvestigator);
                                    }
                                }}
                                renderInput={(params) =>
                                    <TextField
                                        {...params}
                                        placeholder='חוקר'
                                    />
                                }
                                classes={{
                                    option: classes.userSelectOption
                                }}
                            />
                        </div>
                    )
                }
                else {
                    return (
                        <div className={classes.selectedInvestigator}>
                            {isUnassigned && <UnassignedWarning />}
                            {indexedRow[cellName as keyof typeof TableHeadersNames]}
                        </div>
                    )
                }
            case TableHeadersNames.county:
                if (selectedRow === indexedRow.epidemiologyNumber && countyAutoCompleteClicked) {
                    return (
                        <Autocomplete
                            options={Array.from(allCounties, ([id, value]) => ({ id, value }))}
                            getOptionLabel={(option) => option.value.displayName}
                            inputValue={currCounty.displayName}
                            onChange={(event, newSelectedCounty) => {
                                if (event?.type !== 'blur') {
                                    onCountyChange(indexedRow, newSelectedCounty);
                                }
                            }}
                            onInputChange={(event, selectedCounty) => {
                                if (event?.type !== 'blur') {
                                    const updatedCounty: County = {
                                        id: getCountyMapKeyByValue(allCounties, selectedCounty),
                                        displayName: selectedCounty
                                    }
                                    setCurrCounty(updatedCounty);
                                }
                            }}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    placeholder='נפה'
                                />
                            }
                        />)
                }
                else {
                    return indexedRow[cellName as keyof typeof TableHeadersNames]
                }
            case TableHeadersNames.investigationDesk:
                if (selectedRow === indexedRow.epidemiologyNumber && deskAutoCompleteClicked &&
                    (user.userType === userType.ADMIN || user.userType === userType.SUPER_ADMIN ) && !wasInvestigationFetchedByGroup) {
                    return (
                        <Autocomplete
                            options={allDesks}
                            getOptionLabel={(option) => option.deskName}
                            onChange={(event, newSelectedDesk) => {
                                onDeskChange(indexedRow, newSelectedDesk);
                            }}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    placeholder='דסק'
                                />
                            }
                            renderTags={(tags) => {
                                const additionalTagsAmount = tags.length - 1;
                                const additionalDisplay = additionalTagsAmount > 0 ? ` (+${additionalTagsAmount})` : '';
                                return tags[0] + additionalDisplay;
                            }}
                        />
                    )
                }
                else {
                    const deskValue = indexedRow[cellName as keyof typeof TableHeadersNames];
                    return deskValue ? deskValue : unassignedToDesk
                }
            case TableHeadersNames.priority:
                let cssClass = '';
                if (indexedRow.isComplex) {
                    cssClass = classes.priorityWithComplex
                } else {
                    if (isScreenWide) {
                        cssClass = classes.priorityWithoutComplex;
                    } else {
                        cssClass = classes.priorityWithoutComplexSmall;
                    }
                }

                return (
                    <div className={classes.priorityCell}>
                        {indexedRow.isComplex && <ComplexityIcon tooltipText={complexInvestigationMessage} />}
                        <span className={cssClass}>
                            {indexedRow[cellName as keyof typeof TableHeadersNames] || noPriorityMessage}
                        </span>
                    </div>
                );
            case TableHeadersNames.comment:
                return <CommentDisplay comment={indexedRow[cellName as keyof typeof TableHeadersNames]}
                    scrollableRef={tableContainerRef.current} />
            case TableHeadersNames.investigationStatus:
                const investigationStatus = indexedRow[cellName as keyof typeof TableHeadersNames];
                const epidemiologyNumber = indexedRow[TableHeadersNames.epidemiologyNumber];
                return <InvestigationStatusColumn
                    investigationStatus={investigationStatus}
                    investigationSubStatus={indexedRow.investigationSubStatus}
                    statusReason={indexedRow.statusReason}
                    epidemiologyNumber={epidemiologyNumber}
                    moveToTheInvestigationForm={moveToTheInvestigationForm}
                />
            case TableHeadersNames.multipleCheck:
                const isGroupShown = checkGroupedInvestigationOpen.includes(indexedRow.epidemiologyNumber);
                return (
                    <>
                        {(!wasInvestigationFetchedByGroup) &&
                            <Checkbox onClick={(event) => {
                                event.stopPropagation();
                                markRow(indexedRow.epidemiologyNumber, indexedRow.groupId);
                            }} color='primary' checked={isRowSelected(indexedRow.epidemiologyNumber)}
                            className={indexedRow.groupId ? '' : classes.padCheckboxWithoutGroup} />}
                        {indexedRow.canFetchGroup &&
                        <Tooltip title={isGroupShown ? hideInvestigationGroupText : showInvestigationGroupText} placement='top' arrow>
                            <IconButton onClick={(event) => {
                                event.stopPropagation();
                                openGroupedInvestigation(indexedRow.epidemiologyNumber)
                                if (!allGroupedInvestigations.get(indexedRow.groupId)) {
                                    fetchInvestigationsByGroupId(indexedRow.groupId)      
                                }
                            }}>
                                {isGroupShown ?
                                    <KeyboardArrowDown /> :
                                    <KeyboardArrowLeft />}
                            </IconButton>
                        </Tooltip>
                        }
                    </>
                )
            case TableHeadersNames.settings: 
                return <SettingsActions
                            epidemiologyNumber={indexedRow.epidemiologyNumber}
                            groupId={indexedRow.groupId}
                            fetchTableData={fetchTableData}
                            fetchInvestigationsByGroupId={fetchInvestigationsByGroupId}
                       />
            default:
                return indexedRow[cellName as keyof typeof TableHeadersNames]
        }
    }

    const handleRequestSort = (event: any, property: React.SetStateAction<string>) => {
        const isAsc = orderBy === property && order === SortOrder.asc;
        const newOrder = isAsc ? SortOrder.desc : SortOrder.asc;
        setOrder(newOrder);
        setOrderBy(property);
        property === defaultOrderBy ? sortInvestigationTable(property) : sortInvestigationTable(property + newOrder.toLocaleUpperCase());
    };

    const closeFilterRow = () => setShowFilterRow(false);

    const toggleFilterRow = () => setShowFilterRow(!showFilterRow);

    const clearSearchBarQuery = () => {
        phoneAndIdentityNumberRegex.test(searchBarQuery) ? handleFilterChange(filterCreators[InvestigationsFilterByFields.NUMERIC_PROPERTIES]('')) :
            handleFilterChange(filterCreators[InvestigationsFilterByFields.FULL_NAME](''));
        setSearchBarQuery('');
    }

    const onSearchBarType = (typedInQuery: string) => {
        if (stringAlphanum.isValidSync(typedInQuery)) {
            setSearchBarQuery(typedInQuery)
            !isSearchBarValid &&
            setIsSearchBarValid(true);
        } else {
            setIsSearchBarValid(false);
        }
    }

    const markRow = async (epidemiologyNumber: number, groupId: string) => {
        const epidemiologyNumberIndex = checkedRowsIds.findIndex(checkedRow => epidemiologyNumber === checkedRow);
        if (epidemiologyNumberIndex !== -1) {
            const gropuedInvestigationsById = allGroupedInvestigations.get(groupId)
            if (gropuedInvestigationsById) {
                let checkedGroupRows: number[] = []
                gropuedInvestigationsById.forEach(row => {
                    checkedGroupRows.push(row.epidemiologyNumber)
                })
                setCheckedRowsIds(checkedRowsIds.filter(rowId => checkedGroupRows.indexOf(rowId) === -1));
            } else {
                setCheckedRowsIds(checkedRowsIds.filter(rowId => rowId !== epidemiologyNumber));
            }
        } else {
            if (groupId) {
                if (!allGroupedInvestigations.get(groupId)) {
                    await fetchInvestigationsByGroupId(groupId)
                }
                let checkedGroupRows: number[] = []
                allGroupedInvestigations.get(groupId)?.forEach(row => {
                    checkedGroupRows.push(row.epidemiologyNumber)
                })
                setCheckedRowsIds([...checkedRowsIds, ...checkedGroupRows]);
            } else {
                setCheckedRowsIds([...checkedRowsIds, epidemiologyNumber]);
            }
        }
    }

    const openGroupedInvestigation = (epidemiologyNumber: number) => {
        checkGroupedInvestigationOpen.includes(epidemiologyNumber) ?
            setCheckGroupedInvestigationOpen(checkGroupedInvestigationOpen.filter(rowId => rowId !== epidemiologyNumber)) :
            setCheckGroupedInvestigationOpen([...checkGroupedInvestigationOpen, epidemiologyNumber])
    }

    const onSelectedStatusesChange = (event: React.ChangeEvent<{}>, selectedStatuses: string[]) => {
        const nextFilterByStatuses = selectedStatuses.includes(ALL_STATUSES_FILTER_OPTIONS) ?
            []
            :
            selectedStatuses;
        setFilterByStatuses(nextFilterByStatuses);
        handleFilterChange(filterCreators[InvestigationsFilterByFields.STATUS](nextFilterByStatuses));
    }

    const onSelectedDesksChange = (event: React.ChangeEvent<{}>, selectedDesks: Desk[]) => {
        setFilterByDesks(selectedDesks);
        handleFilterChange(filterCreators[InvestigationsFilterByFields.DESK_ID](selectedDesks.map(desk => desk.id)));
    }

    const onSearchClick = () => {
        phoneAndIdentityNumberRegex.test(searchBarQuery) ?
            handleFilterChange(filterCreators[InvestigationsFilterByFields.NUMERIC_PROPERTIES](searchBarQuery)) :
            handleFilterChange(filterCreators[InvestigationsFilterByFields.FULL_NAME](searchBarQuery));
    }

    const filterIconByToggle = () => {
        const filterIcon = <FontAwesomeIcon icon={faFilter} style={{ fontSize: '15px' }} />;
        if (showFilterRow) return <Badge
            anchorOrigin={{ vertical: 'top', horizontal: 'left', }} variant='dot' badgeContent='' color='error'>{filterIcon}
        </Badge>
        return filterIcon
    }

    const isInvestigationRowClickable = (investigationStatus: string) =>
        !(user.userType === userType.INVESTIGATOR && investigationStatus === InvestigationMainStatus.DONE)

    const counterDescription: string = useMemo(() => {
        const adminMessage = `, מתוכן ${unassignedInvestigationsCount} לא מוקצות`;
        return `ישנן ${tableRows.length}  חקירות בסך הכל ${(user.userType === userType.ADMIN || user.userType === userType.SUPER_ADMIN) ? adminMessage : ``}`;

    }, [tableRows, unassignedInvestigationsCount]);

    return (
        <div tabIndex={0}
            onClick={closeDropdowns}
            onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) =>
                event.key === 'Escape' && closeDropdowns()}
        >
            <Grid className={classes.title} container alignItems='center' justify='space-between'>
                <Grid item xs={2}></Grid>
                <Grid item xs={8}>
                    <Typography color='textPrimary' className={classes.welcomeMessage}>
                        {tableRows.length === 0 ? noInvestigationsMessage : welcomeMessage}
                    </Typography>
                </Grid>
                <Grid item xs={2} >
                    <Card className={classes.filterByDeskCard}>
                        <Typography className={classes.deskFilterTitle}>הדסקים בהם הנך צופה כעת:</Typography>
                        <Autocomplete
                            disableCloseOnSelect
                            multiple
                            options={allDesks}
                            getOptionLabel={(option) => option.deskName}
                            onChange={onSelectedDesksChange}
                            value={filterByDesks}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                />
                            }
                            renderTags={(tags: Desk[]) => {
                                const additionalTagsAmount = tags.length - 1;
                                const additionalDisplay = additionalTagsAmount > 0 ? ` (+${additionalTagsAmount})` : '';
                                return tags[0].deskName + additionalDisplay;
                            }}
                            classes={{ inputRoot: classes.autocompleteInput }}
                        />
                    </Card>
                </Grid>
            </Grid>
            <Grid className={classes.content}>
                <div className={classes.tableHeaderRow}>
                    <Typography color='primary' className={classes.counterLabel} >
                        {counterDescription}
                    </Typography>
                    <Box justifyContent='flex-end'>
                        <TextField
                            className={classes.searchBar}
                            value={searchBarQuery}
                            onChange={event => onSearchBarType(event.target.value)}
                            onKeyPress={event => {
                                event.key === 'Enter' &&
                                    onSearchClick();
                            }}
                            label={isSearchBarValid ? searchBarLabel : searchBarError}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        {
                                            Boolean(searchBarQuery) &&
                                                <IconButton className={classes.searchBarIcons} onClick={clearSearchBarQuery}>
                                                    <Close/>
                                                </IconButton>
                                        }
                                        <IconButton className={classes.searchBarIcons} onClick={onSearchClick}>
                                            <Search />
                                        </IconButton>
                                    </InputAdornment>

                                ),
                            }}
                            error={!isSearchBarValid}
                        />
                        <Button
                            color='primary'
                            className={classes.filterButton}
                            startIcon={filterIconByToggle()}
                            onClick={toggleFilterRow}
                        />
                        <Button
                            color='primary'
                            className={classes.sortResetButton}
                            startIcon={<Refresh />}
                            onClick={(event: any) => handleRequestSort(event, defaultOrderBy)}
                        >
                            {resetSortButtonText}
                        </Button>
                    </Box>
                </div>
                <Grid container justify="flex-end" className={classes.filterTableRow}>
                    <Collapse in={showFilterRow}>
                        <Card className={classes.filterTableCard}>
                            <Typography>סינון לפי</Typography>
                            <Typography>סטטוס:</Typography>
                            <Autocomplete
                                classes={{ inputRoot: classes.autocompleteInput }}
                                disableCloseOnSelect
                                multiple
                                options={allStatuses}
                                getOptionLabel={(option) => option}
                                onChange={onSelectedStatusesChange}
                                value={filterByStatuses}
                                renderInput={(params) =>
                                    <TextField
                                        {...params}
                                    />
                                }
                                renderTags={(tags) => {
                                    const additionalTagsAmount = tags.length - 1;
                                    const additionalDisplay = additionalTagsAmount > 0 ? ` (+${additionalTagsAmount})` : '';
                                    return tags[0] + additionalDisplay;
                                }}
                            />
                            <IconButton onClick={() => closeFilterRow()}><Close /></IconButton>
                        </Card>
                    </Collapse>
                </Grid>
                <TableContainer ref={tableContainerRef} component={Paper} className={classes.tableContainer}>
                    <Table aria-label='simple table' stickyHeader id='LandingPageTable'>
                        <TableHead>
                            <TableRow>
                                {
                                    Object.values((user.userType === userType.ADMIN || user.userType === userType.SUPER_ADMIN) ? adminCols : userCols).map((key) => (
                                        <TableCell
                                            classes={{ stickyHeader: classes.horizontalSticky }}
                                            className={classes.tableHeaderCell + ' ' + (key === TableHeadersNames.investigatorName ? classes.columnBorder : '')}
                                            sortDirection={orderBy === key ? order : false}
                                        >
                                            {
                                                TableHeaders[key as keyof typeof TableHeadersNames]
                                            }
                                            {
                                                sortableCols[key as keyof typeof TableHeadersNames] &&
                                                <TableSortLabel
                                                    classes={{ root: key === orderBy ? classes.activeSortIcon : '', icon: classes.icon, active: classes.active }}
                                                    active
                                                    direction={orderBy === key ? order : SortOrder.asc}
                                                    onClick={(event: any) => handleRequestSort(event, key)}>
                                                </TableSortLabel>
                                            }
                                        </TableCell>
                                    ))
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableRows.map((row: InvestigationTableRow, index: number) => {
                                const indexedRow = convertToIndexedRow(row);
                                const isRowClickable = isInvestigationRowClickable(row.mainStatus);
                                return (
                                    <>
                                        <TableRow selected={isRowSelected(indexedRow.epidemiologyNumber)}
                                            key={indexedRow.epidemiologyNumber} classes={{ selected: classes.checkedRow }}
                                            className={[classes.investigationRow, isRowClickable && classes.clickableInvestigationRow].join(' ')}
                                            onClick={() => isRowClickable && onInvestigationRowClick(indexedRow)}
                                        >
                                            {
                                                Object.values((user.userType === userType.ADMIN || user.userType === userType.SUPER_ADMIN) ? adminCols : userCols).map((key: string) => (
                                                    <TableCell
                                                        style={{ borderRightColor: indexedRow.groupId && key === TableHeadersNames.multipleCheck ? investigationColor.current.get(row.groupId) : '' }}
                                                        className={getTableCellStyles(index, key).join(' ')}
                                                        onClick={(event: any) => handleCellClick(event, key, indexedRow.epidemiologyNumber)}
                                                    >
                                                        {
                                                            getTableCell(key, indexedRow)
                                                        }
                                                    </TableCell>
                                                ))
                                            }
                                        </TableRow>
                                        {checkGroupedInvestigationOpen.includes(indexedRow.epidemiologyNumber) &&
                                            allGroupedInvestigations.get(indexedRow.groupId)?.filter((row: InvestigationTableRow) => row.epidemiologyNumber !== indexedRow.epidemiologyNumber).map((row: InvestigationTableRow) => {
                                                const indexedGroupedInvestigationRow = convertToIndexedRow(row);
                                                const isGroupedRowClickable = isInvestigationRowClickable(row.mainStatus);
                                                return(
                                                    <TableRow selected={isRowSelected(indexedGroupedInvestigationRow.epidemiologyNumber)}
                                                    key={indexedGroupedInvestigationRow.epidemiologyNumber} classes={{ selected: classes.checkedRow }}
                                                    className={[classes.investigationRow, isGroupedRowClickable && classes.clickableInvestigationRow].join(' ')}
                                                    onClick={() => isGroupedRowClickable && onInvestigationRowClick(indexedGroupedInvestigationRow)}
                                                    >
                                                        {
                                                            Object.values((user.userType === userType.ADMIN || user.userType === userType.SUPER_ADMIN) ? adminCols : userCols).map((key: string) => (
                                                                <TableCell
                                                                    style={{ borderRightColor: indexedGroupedInvestigationRow.groupId && key === TableHeadersNames.multipleCheck ? investigationColor.current.get(row.groupId) : '' }}
                                                                    className={getTableCellStyles(index, key).join(' ')}
                                                                    onClick={(event: any) => handleCellClick(event, key, indexedGroupedInvestigationRow.epidemiologyNumber)}
                                                                >
                                                                    {
                                                                        getTableCell(key, indexedGroupedInvestigationRow)
                                                                    }
                                                            </TableCell>
                                                        ))
                                            }
                                                    </TableRow>
                                                )
                                            })
                                        }
                                    </>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Pagination
                    page={currentPage}
                    count={totalPageCount}
                    onChange={(event, value) => setCurrentPage(value)}
                    size='large'
                    className={classes.pagination}
                />
            </Grid>
            <Slide direction='up' in={checkedRowsIds.length > 0} mountOnEnter unmountOnExit>
                <InvestigationTableFooter
                    allInvestigators={getFilteredUsersOfCurrentCounty()}
                    checkedRowsIds={checkedRowsIds}
                    allDesks={allDesks}
                    onDialogClose={() => setCheckedRowsIds([])}
                    tableRows={tableRows}
                    setTableRows={setTableRows}
                    fetchTableData={fetchTableData}
                />
            </Slide>
            <RefreshSnackbar isOpen={snackbarOpen}
                onClose={onCancel} onOk={onOk}
                message={refreshPromptMessage} />
        </div>
    );
}

export default InvestigationTable;
