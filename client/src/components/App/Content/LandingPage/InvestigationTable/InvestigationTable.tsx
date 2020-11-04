import { useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import {
    Paper, Table, TableRow, TableBody, TableCell, Typography,
    TableHead, TableContainer, TextField, TableSortLabel, Button, Popper,
    useMediaQuery, Tooltip, Card, Collapse, IconButton, Badge, Grid
} from '@material-ui/core';
import { Refresh, Warning, Close } from '@material-ui/icons';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import User from 'models/User';
import County from 'models/County';
import userType from 'models/enums/UserType';
import Investigator from 'models/Investigator';
import SortOrder from 'models/enums/SortOrder';
import FilterTableOption from 'models/FilterTableOption';
import InvestigationTableRow from 'models/InvestigationTableRow';
import Desk from 'models/Desk';
import StoreStateType from 'redux/storeStateType';
import RefreshSnackbar from 'commons/RefreshSnackbar/RefreshSnackbar';
import InvestigationMainStatus from 'models/enums/InvestigationMainStatus';
import ComplexityIcon from 'commons/InvestigationComplexity/ComplexityIcon/ComplexityIcon';

import useStyles from './InvestigationTableStyles';
import CommentDisplay from './commentDisplay/commentDisplay';
import InvestigationStatusColumn from './InvestigationStatusColumn/InvestigationStatusColumn';
import { TableHeadersNames, TableHeaders, adminCols, userCols, Order, sortableCols } from './InvestigationTablesHeaders';
import useInvestigationTable, { UNDEFINED_ROW, ALL_STATUSES_FILTER_OPTIONS, ALL_DESKS_FILTER_OPTIONS } from './useInvestigationTable';

export const defaultOrderBy = 'defaultOrder';
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

const defaultInvestigator = {
    id: '',
    countyId: 0,
    userName: ''
};

const defaultCounty = {
    id: 0,
    displayName: ''
}

const defaultFilterOptions: FilterTableOption = { mainStatus: [ALL_STATUSES_FILTER_OPTIONS], investigationDesk: [ALL_DESKS_FILTER_OPTIONS] };

const refreshPromptMessage = 'שים לב, ייתכן כי התווספו חקירות חדשות';
const unassignedToDesk = 'לא שוייך לדסק';

const InvestigationTable: React.FC = (): JSX.Element => {

    const classes = useStyles();
    const isScreenWide = useMediaQuery('(min-width: 1680px)');

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
    const [filterOptions, setFilterOptions] = useState<FilterTableOption>(defaultFilterOptions);
    const [showFilterRow, setShowFilterRow] = useState<boolean>(false);
    const [filteredTableRows, setFilteredTableRows] = useState<InvestigationTableRow[]>([]);
    const [allDesks, setAllDesks] = useState<Desk[]>([]);

    const {
        onCancel, onOk, snackbarOpen, tableRows, onInvestigationRowClick, convertToIndexedRow, getCountyMapKeyByValue,
        sortInvestigationTable, getUserMapKeyByValue, onInvestigatorChange, onCountyChange, onDeskChange, getTableCellStyles,
        moveToTheInvestigationForm
    } = useInvestigationTable({
        selectedInvestigator, setSelectedRow, setAllUsersOfCurrCounty,
        setAllCounties, setAllStatuses, setAllDesks
    });

    const user = useSelector<StoreStateType, User>(state => state.user);

    useEffect(() => {
        let filteredRows: InvestigationTableRow[] = [...tableRows];
        if (filterOptions !== defaultFilterOptions) {
            filteredRows = filteredRows.filter(row => {
                const indexedRow: { [index: string]: any } = { ...row };
                return !Object.keys(filterOptions).some(key => !(filterOptions[key].includes(indexedRow[key]) || filterOptions[key].includes(defaultFilterOptions[key][0])))
            })
        }
        setFilteredTableRows(filteredRows);
    }, [tableRows, filterOptions])

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
    }

    const CustomPopper = (props: any) => {
        return (<Popper {...props} style={{ width: 350 }} placement='bottom-start' />)
    }

    const UnassignedWarning = () => (
        <Tooltip title='לא הוקצה חוקר לחקירה'>
            <Warning className={classes.warningIcon} />
        </Tooltip>
    )

    const getTableCell = (cellName: string, indexedRow: { [T in keyof typeof TableHeadersNames]: any }) => {
        switch (cellName) {
            case TableHeadersNames.investigatorName:
                const isUnassigned = indexedRow.investigatorName === 'לא משויך';
                if (selectedRow === indexedRow.epidemiologyNumber && investigatorAutoCompleteClicked) {
                    return (
                        <div className={classes.selectedInvestigator}>
                            {isUnassigned && <UnassignedWarning />}
                            <Autocomplete
                                PopperComponent={CustomPopper}
                                test-id='currentInvetigationUser'
                                options={Array.from(allUsersOfCurrCounty, ([id, value]) => ({ id, value }))}
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
                                                                ${option.value.deskName ? option.value.deskName : hasNoDesk}` : `${hasNoSourceOrganization}, ${hasNoDesk}`
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
                                    const updatedInvestigator = {
                                        id: getUserMapKeyByValue(allUsersOfCurrCounty, selectedInvestigatorName),
                                        userName: selectedInvestigatorName
                                    }
                                    setSelectedInvestigator(updatedInvestigator);
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
                                onCountyChange(indexedRow, newSelectedCounty, indexedRow.county)
                            }}
                            onInputChange={(event, selectedCounty) => {
                                const updatedCounty: County = {
                                    id: getCountyMapKeyByValue(allCounties, selectedCounty),
                                    displayName: selectedCounty
                                }
                                setCurrCounty(updatedCounty);
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
                    (user.userType === userType.ADMIN || user.userType === userType.SUPER_ADMIN)) {
                    return (
                        <Autocomplete
                            options={allDesks}
                            getOptionLabel={(option) => option.deskName}
                            onChange={(event, newSelectedDesk) => {
                                onDeskChange(indexedRow, newSelectedDesk, indexedRow.investigationDesk)
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
                    return indexedRow[cellName as keyof typeof TableHeadersNames] ? 
                           indexedRow[cellName as keyof typeof TableHeadersNames] : unassignedToDesk 
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
                return <CommentDisplay comment={indexedRow[cellName as keyof typeof TableHeadersNames]} />
            case TableHeadersNames.investigationStatus:
                const investigationStatus = indexedRow[cellName as keyof typeof TableHeadersNames];
                const epidemiologyNumber = indexedRow[TableHeadersNames.epidemiologyNumber];
                return <InvestigationStatusColumn
                    investigationStatus={investigationStatus}
                    epidemiologyNumber={epidemiologyNumber}
                    moveToTheInvestigationForm={moveToTheInvestigationForm}
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

    const onSelectedStatusesChange = (event: React.ChangeEvent<{}>, selectedStatuses: string[]) => {
        const newFilterOptions: FilterTableOption = { ...filterOptions };

        if (selectedStatuses.length === 0) {
            newFilterOptions.mainStatus = [ALL_STATUSES_FILTER_OPTIONS];
        } else if (selectedStatuses.includes(ALL_STATUSES_FILTER_OPTIONS)) {
            if (!filterOptions.mainStatus.includes(ALL_STATUSES_FILTER_OPTIONS)) {
                newFilterOptions.mainStatus = [ALL_STATUSES_FILTER_OPTIONS];
            } else {
                newFilterOptions.mainStatus = selectedStatuses.filter(status => status !== ALL_STATUSES_FILTER_OPTIONS);
            }
        } else {
            newFilterOptions.mainStatus = selectedStatuses;
        }
        setFilterOptions(newFilterOptions);
    }

    const onSelectedDesksChange = (event: React.ChangeEvent<{}>, selectedDesks: string[]) => {
        const newFilterOptions: FilterTableOption = { ...filterOptions };

        if (selectedDesks.length === 0) {
            newFilterOptions.investigationDesk = [ALL_DESKS_FILTER_OPTIONS];
        } else if (selectedDesks.includes(ALL_DESKS_FILTER_OPTIONS)) {
            if (!filterOptions.investigationDesk.includes(ALL_DESKS_FILTER_OPTIONS)) {
                newFilterOptions.investigationDesk = [ALL_DESKS_FILTER_OPTIONS];
            } else {
                newFilterOptions.investigationDesk = selectedDesks.filter(desk => desk !== ALL_DESKS_FILTER_OPTIONS);
            }
        } else {
            newFilterOptions.investigationDesk = selectedDesks;
        }
        setFilterOptions(newFilterOptions);
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

    return (
        <>
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
                            options={allDesks.map((desk: Desk) => desk.deskName)}
                            getOptionLabel={(option) => option}
                            onChange={onSelectedDesksChange}
                            value={filterOptions.investigationDesk}
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
                            classes={{ inputRoot: classes.autocompleteInput }}
                        />
                    </Card>
                </Grid>
            </Grid>
            <Grid className={classes.content}>
                <Grid container justify="flex-end" className={classes.tableHeaderRow}>
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
                </Grid>
                <Grid container justify="flex-end" className={classes.tableHeaderRow}>
                    {
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
                                    value={filterOptions.mainStatus}
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
                                <IconButton><Close onClick={() => closeFilterRow()} /></IconButton>
                            </Card>
                        </Collapse>
                    }
                </Grid>
                <TableContainer component={Paper} className={classes.tableContainer}>
                    <Table aria-label='simple table' stickyHeader id='LandingPageTable'>
                        <TableHead>
                            <TableRow>
                                {
                                    Object.values((user.userType === userType.ADMIN || user.userType === userType.SUPER_ADMIN) ? adminCols : userCols).map((key) => (
                                        <TableCell
                                            className={key === TableHeadersNames.investigatorName ? classes.columnBorder : ''}
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
                            {filteredTableRows.map((row: InvestigationTableRow, index: number) => {
                                const indexedRow = convertToIndexedRow(row);
                                const isRowClickable = isInvestigationRowClickable(row.mainStatus);
                                return (
                                    <TableRow
                                        key={indexedRow.epidemiologyNumber}
                                        className={[classes.investigationRow, isRowClickable && classes.clickableInvestigationRow].join(' ')}
                                        onClick={() => isRowClickable && onInvestigationRowClick(indexedRow)}
                                    >
                                        {
                                            Object.values((user.userType === userType.ADMIN || user.userType === userType.SUPER_ADMIN) ? adminCols : userCols).map((key: string) => (
                                                <TableCell
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
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            <RefreshSnackbar isOpen={snackbarOpen}
                onClose={onCancel} onOk={onOk}
                message={refreshPromptMessage} />
        </>
    );
}

export default InvestigationTable;
