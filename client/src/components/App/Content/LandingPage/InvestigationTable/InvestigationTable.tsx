import { useSelector } from 'react-redux';
import React, { useMemo, useState, useRef } from 'react';
import { Autocomplete, Pagination } from '@material-ui/lab';
import {
    Paper, Table, TableRow, TableBody, TableCell, Typography,
    TableHead, TableContainer, TextField, TableSortLabel, Button,
    useMediaQuery, Tooltip, Collapse, IconButton, Badge, Grid, Checkbox,
    Slide, Box, InputAdornment, useTheme, Popover
} from '@material-ui/core';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Refresh, Warning, Close, KeyboardArrowDown, KeyboardArrowLeft, Search, Edit } from '@material-ui/icons';

import Desk from 'models/Desk';
import User from 'models/User';
import County from 'models/County';
import userType from 'models/enums/UserType';
import SortOrder from 'models/enums/SortOrder';
import StoreStateType from 'redux/storeStateType';
import { defaultEpidemiologyNumber } from 'Utils/consts';
import InvestigatorOption from 'models/InvestigatorOption';
import InvestigationTableRow from 'models/InvestigationTableRow';
import InvestigationMainStatus from 'models/InvestigationMainStatus';
import RefreshSnackbar from 'commons/RefreshSnackbar/RefreshSnackbar';
import InvestigationMainStatusCodes from 'models/enums/InvestigationMainStatusCodes';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';

import useStyles from './InvestigationTableStyles';
import CommentDisplay from './commentDisplay/commentDisplay';
import SettingsActions from './SettingsActions/SettingsActions';
import InvestigatorAllocation from './InvestigatorAllocation/InvestigatorAllocation';
import InvestigationTableFooter from './InvestigationTableFooter/InvestigationTableFooter';
import InvestigationStatusColumn from './InvestigationStatusColumn/InvestigationStatusColumn';
import InvestigationNumberColumn from './InvestigationNumberColumn/InvestigationNumberColumn';
import useInvestigationTable, { UNDEFINED_ROW } from './useInvestigationTable';
import { TableHeadersNames, TableHeaders, adminCols, userCols, Order, sortableCols, IndexedInvestigation } from './InvestigationTablesHeaders';
import DeskFilter from './DeskFilter/DeskFilter';
import StatusFilter from './StatusFilter/StatusFilter';

export const defaultOrderBy = 'defaultOrder';
export const defaultPage = 1;
const resetSortButtonText = 'סידור לפי תעדוף';
const welcomeMessage = 'היי, אלו הן החקירות שהוקצו לך היום. בואו נקטע את שרשראות ההדבקה!';
const noInvestigationsMessage = 'היי,אין חקירות לביצוע!';
const searchBarLabel = 'הכנס מס\' אפידימיולוגי, ת\"ז, שם מלא או טלפון...';
const searchBarError = 'יש להכניס רק אותיות ומספרים';

export const rowsPerPage = 100;

const refreshPromptMessage = 'שים לב, ייתכן כי התווספו חקירות חדשות';
const unassignedToDesk = 'לא שוייך לדסק';
const showInvestigationGroupText = 'הצג חקירות קשורות';
const hideInvestigationGroupText = 'הסתר חקירות קשורות';
const emptyGroupText = 'שים לב, בסבירות גבוהה לחקירה זו קובצו חקירות ישנות שכבר לא קיימות במערכת'

const InvestigationTable: React.FC = (): JSX.Element => {
    const isScreenWide = useMediaQuery('(min-width: 1680px)');
    const classes = useStyles(isScreenWide);
    const { alertWarning } = useCustomSwal();
    const theme = useTheme();

    const [checkedIndexedRows, setCheckedIndexedRows] = useState<IndexedInvestigation[]>([]);
    const [selectedRow, setSelectedRow] = useState<number>(UNDEFINED_ROW);
    const [deskAutoCompleteClicked, setDeskAutoCompleteClicked] = useState<boolean>(false);
    const [allUsersOfCurrCounty, setAllUsersOfCurrCounty] = useState<Map<string, User>>(new Map());
    const [allCounties, setAllCounties] = useState<Map<number, County>>(new Map());
    const [order, setOrder] = useState<Order>(SortOrder.asc);
    const [orderBy, setOrderBy] = useState<string>(defaultOrderBy);
    const [allStatuses, setAllStatuses] = useState<InvestigationMainStatus[]>([]);
    const [showFilterRow, setShowFilterRow] = useState<boolean>(false);
    const [allDesks, setAllDesks] = useState<Desk[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(defaultPage);
    const [checkGroupedInvestigationOpen, setCheckGroupedInvestigationOpen] = useState<number[]>([])
    const [allGroupedInvestigations, setAllGroupedInvestigations] = useState<Map<string, InvestigationTableRow[]>>(new Map());
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [shouldOpenPopover, setShouldOpenPopover] = useState<boolean>(false);
    const [shouldOpenInvestigatorAllocation, setShouldOpenInvestigatorsAllocation] = useState<boolean>(false);
    const [epiNumOnInvestigatorNameHover, setEpiNumOnInvestigatorNameHover] = useState<number>(defaultEpidemiologyNumber);

    const handleOpenGroupClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setAnchorEl(null);
    };
    const closeDropdowns = () => {
        setDeskAutoCompleteClicked(false);
    }

    const tableContainerRef = useRef<HTMLElement>();
    const investigationColor = useRef<Map<string, string>>(new Map())

    const {
        onCancel, onOk, snackbarOpen, tableRows, onInvestigationRowClick, convertToIndexedRow,
        sortInvestigationTable, changeGroupsDesk, changeInvestigationsDesk, getNestedCellStyle, getRegularCellStyle,
        moveToTheInvestigationForm, totalCount, unassignedInvestigationsCount,
        fetchInvestigationsByGroupId, fetchTableData, changeGroupsInvestigator, changeInvestigationsInvestigator,
        statusFilter, changeStatusFilter, deskFilter, changeDeskFilter, searchQuery, changeSearchQuery, isSearchQueryValid,
    } = useInvestigationTable({
        setSelectedRow, setAllUsersOfCurrCounty, allGroupedInvestigations,
        setAllCounties, setAllStatuses, setAllDesks, currentPage, setCurrentPage, setAllGroupedInvestigations,
        investigationColor
    });

    const user = useSelector<StoreStateType, User>(state => state.user.data);

    const totalPageCount = Math.ceil(totalCount / rowsPerPage);

    const isRowSelected = (epidemiologyNumber: number) => checkedIndexedRows.map(indexedRow => indexedRow.epidemiologyNumber).includes(epidemiologyNumber);

    const handleCellClick = (event: any, key: string, epidemiologyNumber: number) => {
        switch (key) {
            case TableHeadersNames.investigatorName: {
                event.stopPropagation();
                setShouldOpenInvestigatorsAllocation(true);
                setDeskAutoCompleteClicked(false);
                break;
            }
            case TableHeadersNames.investigationDesk: {
                event.stopPropagation();
                setDeskAutoCompleteClicked(true);
                break;
            }
        }
        setSelectedRow(epidemiologyNumber);
        setCheckedIndexedRows([]);
    }

    const UnassignedWarning = () => (
        <Tooltip arrow placement='top' title='לא הוקצה חוקר לחקירה'>
            <Warning className={classes.warningIcon} />
        </Tooltip>
    )

    const getFilteredUsersOfCurrentCounty = (): InvestigatorOption[] => {
        const allUsersOfCountyArray = Array.from(allUsersOfCurrCounty, ([id, value]) => ({ id, value }));
        return deskFilter.length === 0 ?
            allUsersOfCountyArray :
            allUsersOfCountyArray.filter(({ id, value }) => {
                if (!value.deskByDeskId) {
                    return false;
                }
                return deskFilter.includes(value.deskByDeskId.id);
            });
    }

    const allocateInvestigationToInvestigator = async (groupId: string, epidemiologyNumber: number, investigatorToAllocate: InvestigatorOption) => {
        groupId ? await changeGroupsInvestigator([groupId], investigatorToAllocate) :
                  await changeInvestigationsInvestigator([epidemiologyNumber], investigatorToAllocate);
        fetchTableData();
    }

    const getTableCell = (cellName: string, indexedRow: { [T in keyof typeof TableHeadersNames]: any }, index:number) => {
        const wasInvestigationFetchedByGroup = indexedRow.groupId && !indexedRow.canFetchGroup;
        switch (cellName) {
            case TableHeadersNames.color:
                return (
                    Boolean(indexedRow.groupId) ?
                        <Tooltip arrow placement='top' title={indexedRow.otherReason !== '' ? indexedRow.otherReason : indexedRow.groupReason}>
                            <div className={classes.groupColor}
                                style={{ backgroundColor: investigationColor.current.get(indexedRow.groupId) }}
                            />
                        </Tooltip> : null
                )
            case TableHeadersNames.epidemiologyNumber:
                return <InvestigationNumberColumn
                    wasInvestigationTransferred={indexedRow.wasInvestigationTransferred}
                    epidemiologyNumber={indexedRow.epidemiologyNumber}
                    transferReason={indexedRow.transferReason}
                />
            case TableHeadersNames.investigatorName:
                if (selectedRow === indexedRow.epidemiologyNumber && shouldOpenInvestigatorAllocation) {
                    return (
                        <InvestigatorAllocation 
                            isOpen={shouldOpenInvestigatorAllocation}
                            setIsOpen={setShouldOpenInvestigatorsAllocation}
                            investigators={getFilteredUsersOfCurrentCounty()}
                            allocateInvestigationToInvestigator={allocateInvestigationToInvestigator}
                            groupId={indexedRow.groupId}
                            epidemiologyNumber={indexedRow.epidemiologyNumber}
                        />
                    )
                } else {
                    const isUnassigned = indexedRow.investigatorName === 'לא משויך';
                    return (
                        <div className={classes.selectedInvestigator}>
                            {isUnassigned && epiNumOnInvestigatorNameHover !== indexedRow.epidemiologyNumber && <UnassignedWarning />}
                            {indexedRow[cellName as keyof typeof TableHeadersNames]}
                            {epiNumOnInvestigatorNameHover === indexedRow.epidemiologyNumber && <Edit fontSize='small' className={classes.editIcon} />}
                            
                        </div>
                    )
                }
            case TableHeadersNames.investigationDesk:
                if (selectedRow === indexedRow.epidemiologyNumber && deskAutoCompleteClicked &&
                    (user.userType === userType.ADMIN || user.userType === userType.SUPER_ADMIN) && !wasInvestigationFetchedByGroup) {
                    return (
                        <Autocomplete
                            options={allDesks}
                            getOptionLabel={(option) => option.deskName}
                            onChange={async (event, newSelectedDesk) => {
                                const switchDeskTitle = `<p>האם אתה בטוח שאתה רוצה להחליף את דסק <b>${indexedRow.investigationDesk}</b> בדסק <b>${newSelectedDesk?.deskName}</b>?</p>`;
                                const enterDeskTitle = `<p>האם אתה בטוח שאתה רוצה לבחור את דסק <b>${newSelectedDesk?.deskName}</b>?</p>`;
                                if (newSelectedDesk?.deskName !== indexedRow.investigationDesk) {
                                    const result = await alertWarning(indexedRow.investigationDesk ? switchDeskTitle : enterDeskTitle, {
                                        showCancelButton: true,
                                        cancelButtonText: 'לא',
                                        cancelButtonColor: theme.palette.error.main,
                                        confirmButtonColor: theme.palette.primary.main,
                                        confirmButtonText: 'כן, המשך',
                                    });
                                    if (result.isConfirmed) {
                                        indexedRow.groupId ?
                                            await changeGroupsDesk([indexedRow.groupId], newSelectedDesk) :
                                            await changeInvestigationsDesk([indexedRow.epidemiologyNumber], newSelectedDesk);
                                        fetchTableData();
                                    }

                                    setSelectedRow(UNDEFINED_ROW);
                                }
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
              case TableHeadersNames.subOccupation:
                  const subOccupation = indexedRow[cellName as keyof typeof TableHeadersNames];
                  const parentOccupation = Boolean(subOccupation) ?  tableRows[index].parentOccupation : '';
                  return    <Tooltip title={parentOccupation} placement='top'>
                                <div>{subOccupation || '-'}</div>
                            </Tooltip>    
            case TableHeadersNames.comment:
                return <CommentDisplay comment={indexedRow[cellName as keyof typeof TableHeadersNames]}
                    scrollableRef={tableContainerRef.current} />
            case TableHeadersNames.investigationStatus:
                const investigationStatus = indexedRow[cellName as keyof typeof TableHeadersNames];
                return investigationStatus && <InvestigationStatusColumn
                    investigationStatus={investigationStatus}
                    investigationSubStatus={indexedRow.investigationSubStatus}
                    statusReason={indexedRow.statusReason}
                />;
            case TableHeadersNames.multipleCheck:
                const isGroupShown = checkGroupedInvestigationOpen.includes(indexedRow.epidemiologyNumber);
                return (
                    <>
                        {(!wasInvestigationFetchedByGroup) &&
                            <Checkbox onClick={(event) => {
                                event.stopPropagation();
                                markRow(indexedRow);
                            }} color='primary' checked={isRowSelected(indexedRow.epidemiologyNumber)} size='small'
                                className={indexedRow.groupId ? '' : classes.padCheckboxWithoutGroup} />}
                        {indexedRow.canFetchGroup &&
                            <Tooltip title={isGroupShown ? hideInvestigationGroupText : showInvestigationGroupText} placement='top' arrow>
                                <IconButton onClick={async (event) => {
                                    setShouldOpenPopover(false);
                                    handleOpenGroupClick(event);
                                    let groupToOpen = allGroupedInvestigations.get(indexedRow.groupId);
                                    event.stopPropagation();
                                    if (!allGroupedInvestigations.get(indexedRow.groupId)) {
                                        groupToOpen = await fetchInvestigationsByGroupId(indexedRow.groupId)
                                    }
                                    if (groupToOpen !== undefined && groupToOpen?.length > 1) {
                                        openGroupedInvestigation(indexedRow.epidemiologyNumber, indexedRow.groupId)
                                    }
                                    setShouldOpenPopover(groupToOpen?.length === 1)
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
                    investigationStatus={indexedRow.investigationStatus}
                    groupId={indexedRow.groupId}
                    allGroupedInvestigations={allGroupedInvestigations}
                    checkGroupedInvestigationOpen={checkGroupedInvestigationOpen}
                    fetchTableData={fetchTableData}
                    fetchInvestigationsByGroupId={fetchInvestigationsByGroupId}
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

    const clearSearchBarQuery = () => {
        changeSearchQuery('');
    }

    const onSearchBarType = (newSearchQuery: string) => {
        changeSearchQuery(newSearchQuery);
    }

    const markRow = async (indexedRow: IndexedInvestigation) => {
        const epidemiologyNumberIndex = checkedIndexedRows.findIndex(checkedRow => indexedRow.epidemiologyNumber === checkedRow.epidemiologyNumber);
        if (epidemiologyNumberIndex !== -1) {
            const gropuedInvestigationsById = allGroupedInvestigations.get(indexedRow.groupId as string)
            if (gropuedInvestigationsById) {
                let checkedGroupRows: number[] = []
                gropuedInvestigationsById.forEach(row => {
                    checkedGroupRows.push(row.epidemiologyNumber)
                })
                setCheckedIndexedRows(checkedIndexedRows.filter(checkedRow => checkedGroupRows.indexOf(checkedRow.epidemiologyNumber as number) === -1));
            } else {
                setCheckedIndexedRows(checkedIndexedRows.filter(checkedRow => checkedRow.epidemiologyNumber !== indexedRow.epidemiologyNumber));
            }
        } else {
            if (indexedRow.groupId) {
                if (!allGroupedInvestigations.get(indexedRow.groupId as string)) {
                    await fetchInvestigationsByGroupId(indexedRow.groupId as string)
                }
                let checkedGroupRows: IndexedInvestigation[] = []
                allGroupedInvestigations.get(indexedRow.groupId as string)?.forEach(row => {
                    checkedGroupRows.push(convertToIndexedRow(row));
                })
                setCheckedIndexedRows([...checkedIndexedRows, ...checkedGroupRows]);
            } else {
                setCheckedIndexedRows([...checkedIndexedRows, indexedRow]);
            }
        }
    }

    const openGroupedInvestigation = (epidemiologyNumber: number, groupId: string) => {
        checkGroupedInvestigationOpen.includes(epidemiologyNumber) ?
            setCheckGroupedInvestigationOpen(checkGroupedInvestigationOpen.filter(rowId => rowId !== epidemiologyNumber)) :
            setCheckGroupedInvestigationOpen([...checkGroupedInvestigationOpen, epidemiologyNumber])
    }

    const onSelectedStatusesChange = (event: React.ChangeEvent<{}>, selectedStatuses: InvestigationMainStatus[]) => {
        changeStatusFilter(selectedStatuses);
    }

    const onSelectedDesksChange = (event: React.ChangeEvent<{}>, selectedDesks: Desk[]) => {
        changeDeskFilter(selectedDesks);
    };

    const onSearchClick = () => {
        if(currentPage !== defaultPage) {
            setCurrentPage(defaultPage);
        } else {
            fetchTableData();
        }
    }

    const filterIconByToggle = () => {
        const filterIcon = <FontAwesomeIcon icon={faFilter} style={{ fontSize: '15px' }} />;
        if (showFilterRow) return <Badge
            anchorOrigin={{ vertical: 'top', horizontal: 'left', }} variant='dot' badgeContent='' color='error'>{filterIcon}
        </Badge>
        return filterIcon
    }

    const isInvestigationRowClickable = (investigationStatus: InvestigationMainStatus) =>
        !(user.userType === userType.INVESTIGATOR && investigationStatus.id === InvestigationMainStatusCodes.DONE)

    const counterDescription: string = useMemo(() => {
        const adminMessage = `, מתוכן ${unassignedInvestigationsCount} לא מוקצות`;
        return `ישנן ${totalCount}  חקירות בסך הכל ${(user.userType === userType.ADMIN || user.userType === userType.SUPER_ADMIN) ? adminMessage : ``}`;

    }, [tableRows, unassignedInvestigationsCount]);

    return (
        <div tabIndex={0}
            onClick={closeDropdowns}
            onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) =>
                event.key === 'Escape' && closeDropdowns()}
        >
            <Grid className={classes.title} container alignItems='center' justify='space-between'>
                <Grid item xs={2}/>
                <Grid item xs={7}>
                    <Typography color='textPrimary' className={classes.welcomeMessage}>
                        {tableRows.length === 0 ? noInvestigationsMessage : welcomeMessage}
                    </Typography>
                </Grid>
                <Grid item xs={3} >
                    <DeskFilter desks={allDesks} filteredDesks={deskFilter} onFilterChange={onSelectedDesksChange} />
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
                            value={searchQuery}
                            onChange={event => onSearchBarType(event.target.value)}
                            onKeyPress={event => {
                                event.key === 'Enter' &&
                                    onSearchClick();
                            }}
                            label={isSearchQueryValid ? searchBarLabel : searchBarError}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        {
                                            searchQuery.length > 0 &&
                                            <IconButton className={classes.searchBarIcons} onClick={clearSearchBarQuery}>
                                                <Close />
                                            </IconButton>
                                        }
                                        <IconButton className={classes.searchBarIcons} onClick={onSearchClick}>
                                            <Search />
                                        </IconButton>
                                    </InputAdornment>

                                ),
                            }}
                            error={!isSearchQueryValid}
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
                <Grid container justify='flex-end' alignItems='center' className={classes.filterTableRow}>
                    <Grid item xs={12} md={4}>
                        <Collapse in={showFilterRow}>
                            <StatusFilter
                                statuses={allStatuses}
                                filteredStatuses={statusFilter}
                                onFilterChange={onSelectedStatusesChange}
                                onClose={closeFilterRow}
                            />
                        </Collapse>
                    </Grid>
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
                                const isGroupShown = checkGroupedInvestigationOpen.includes(indexedRow.epidemiologyNumber);

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
                                                        classes={{ root: classes.tableCellRoot }}
                                                        className={getRegularCellStyle(index, key , isGroupShown).join(' ')}
                                                        onMouseOver={() => key === TableHeadersNames.investigatorName && setEpiNumOnInvestigatorNameHover(indexedRow.epidemiologyNumber)}
                                                        onMouseLeave={() => setEpiNumOnInvestigatorNameHover(defaultEpidemiologyNumber)}
                                                        padding='none'
                                                        onClick={(event: any) => handleCellClick(event, key, indexedRow.epidemiologyNumber)}
                                                    >
                                                        {
                                                            getTableCell(key, indexedRow, index)
                                                        }
                                                    </TableCell>
                                                ))
                                            }
                                        </TableRow>
                                        {checkGroupedInvestigationOpen.includes(indexedRow.epidemiologyNumber) &&
                                            allGroupedInvestigations.get(indexedRow.groupId)?.filter((row: InvestigationTableRow) => row.epidemiologyNumber !== indexedRow.epidemiologyNumber).map((row: InvestigationTableRow, index: number) => {
                                                const currentGroupedInvestigationsLength = allGroupedInvestigations.get(indexedRow.groupId)?.length! - 1; // not including row head
                                                const indexedGroupedInvestigationRow = convertToIndexedRow(row);
                                                const isGroupedRowClickable = isInvestigationRowClickable(row.mainStatus);
                                                return (
                                                    <TableRow selected={isRowSelected(indexedGroupedInvestigationRow.epidemiologyNumber)}
                                                        key={indexedGroupedInvestigationRow.epidemiologyNumber} classes={{ selected: classes.checkedRow }}
                                                        className={[classes.investigationRow, isGroupedRowClickable && classes.clickableInvestigationRow].join(' ')}
                                                        onClick={() => isGroupedRowClickable && onInvestigationRowClick(indexedGroupedInvestigationRow)}
                                                    >
                                                        {
                                                            Object.values((user.userType === userType.ADMIN || user.userType === userType.SUPER_ADMIN) ? adminCols : userCols).map((key: string) => (
                                                                <TableCell
                                                                    classes={{ root: classes.tableCellRoot }}
                                                                    className={getNestedCellStyle(key , index + 1 === currentGroupedInvestigationsLength).join(' ')}
                                                                    onMouseOver={() => key === TableHeadersNames.investigatorName && setEpiNumOnInvestigatorNameHover(row.epidemiologyNumber)}
                                                                    onMouseLeave={() => setEpiNumOnInvestigatorNameHover(defaultEpidemiologyNumber)}
                                                                    onClick={(event: any) => handleCellClick(event, key, indexedGroupedInvestigationRow.epidemiologyNumber)}
                                                                >
                                                                    {
                                                                        getTableCell(key, indexedGroupedInvestigationRow, index)
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
            <Slide direction='up' in={checkedIndexedRows.length > 0} mountOnEnter unmountOnExit>
                <InvestigationTableFooter
                    allInvestigators={getFilteredUsersOfCurrentCounty()}
                    checkedIndexedRows={checkedIndexedRows}
                    allDesks={allDesks}
                    onDialogClose={() => setCheckedIndexedRows([])}
                    tableRows={tableRows}
                    fetchTableData={fetchTableData}
                    onDeskGroupChange={changeGroupsDesk}
                    onDeskChange={changeInvestigationsDesk}
                    onInvestigatorGroupChange={changeGroupsInvestigator}
                    onInvestigatorChange={changeInvestigationsInvestigator}
                    allGroupedInvestigations={allGroupedInvestigations}
                    fetchInvestigationsByGroupId={fetchInvestigationsByGroupId}
                />
            </Slide>
            <RefreshSnackbar isOpen={snackbarOpen}
                onClose={onCancel} onOk={onOk}
                message={refreshPromptMessage} />
            <Popover
                open={Boolean(anchorEl) && shouldOpenPopover}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Typography className={classes.popover}>{emptyGroupText}</Typography>
            </Popover>
        </div>
    );
}

export default InvestigationTable;
