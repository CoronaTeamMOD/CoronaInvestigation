import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Pagination } from '@material-ui/lab';
import {
    Paper, Table, TableRow, TableBody, TableCell, Typography,
    TableHead, TableContainer, TableSortLabel, Button,
    useMediaQuery, Collapse, IconButton, Badge, Grid,
    Slide, Box, useTheme, Popover, Tooltip
} from '@material-ui/core';
import { Refresh, ArrowForward } from '@material-ui/icons';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useMemo, useState, useRef, useEffect } from 'react';

import Desk from 'models/Desk';
import User from 'models/User';
import userType from 'models/enums/UserType';
import SortOrder from 'models/enums/SortOrder';
import StoreStateType from 'redux/storeStateType';
import SearchBar from 'commons/SearchBar/SearchBar';
import useDesksUtils from 'Utils/Desk/useDesksUtils';
import InvestigatorOption from 'models/InvestigatorOption';
import { adminLandingPageRoute } from 'Utils/Routes/Routes';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import InvestigationSubStatus from 'models/InvestigationSubStatus';
import InvestigationTableRowType from 'models/InvestigationTableRow';
import InvestigationMainStatus from 'models/InvestigationMainStatus';
import RefreshSnackbar from 'commons/RefreshSnackbar/RefreshSnackbar';
import InvestigationMainStatusCodes from 'models/enums/InvestigationMainStatusCodes';
import { stringAlphanum } from 'commons/AlphanumericTextField/AlphanumericTextField';

import DeskFilter from './DeskFilter/DeskFilter';
import useStyles from './InvestigationTableStyles';
import TableFilter from './TableFilter/TableFilter';
import InvestigationTableRow from './InvestigationTableRow/InvestigationTableRow';
import InvestigationTableFooter from './InvestigationTableFooter/InvestigationTableFooter';
import InvestigatorAllocationDialog from './InvestigatorAllocation/InvestigatorAllocationDialog';
import useInvestigationTable, { SelectedRow, DEFAULT_SELECTED_ROW } from './useInvestigationTable';
import { TableHeadersNames, TableHeaders, adminCols, userCols, Order, sortableCols, IndexedInvestigation } from './InvestigationTablesHeaders';

export const defaultOrderBy = 'defaultOrder';
export const defaultPage = 1;
const resetSortButtonText = 'סידור לפי תעדוף';
const searchBarLabel = 'הכנס מס\' אפידימיולוגי, ת\"ז, שם מלא או טלפון...';
const returnToAdminLandingPage = 'חזרה לדף הנחיתה';

export const rowsPerPage = 100;

const refreshPromptMessage = 'שים לב, ייתכן כי התווספו חקירות חדשות';
const emptyGroupText = 'שים לב, בסבירות גבוהה לחקירה זו קובצו חקירות ישנות שכבר לא קיימות במערכת'

const InvestigationTable: React.FC = (): JSX.Element => {
    const isScreenWide = useMediaQuery('(min-width: 1680px)');
    const classes = useStyles(isScreenWide);
    const { alertWarning, alertSuccess } = useCustomSwal();
    const onAllocationSuccess = () => alertSuccess('החוקר הוקצה בהצלחה');

    const theme = useTheme();
    const history = useHistory();
    
    const [checkedIndexedRows, setCheckedIndexedRows] = useState<IndexedInvestigation[]>([]);
    const [selectedRow, setSelectedRow] = useState<SelectedRow>(DEFAULT_SELECTED_ROW);
    const [deskAutoCompleteClicked, setDeskAutoCompleteClicked] = useState<boolean>(false);
    const [order, setOrder] = useState<Order>(SortOrder.asc);
    const [orderBy, setOrderBy] = useState<string>(defaultOrderBy);
    const [allStatuses, setAllStatuses] = useState<InvestigationMainStatus[]>([]);
    const [allSubStatuses, setAllSubStatuses] = useState<InvestigationSubStatus[]>([]);
    const [showFilterRow, setShowFilterRow] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(defaultPage);
    const [checkGroupedInvestigationOpen, setCheckGroupedInvestigationOpen] = useState<number[]>([])
    const [allGroupedInvestigations, setAllGroupedInvestigations] = useState<Map<string, InvestigationTableRowType[]>>(new Map());
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [shouldOpenPopover, setShouldOpenPopover] = useState<boolean>(false);
    const [isInvestigatorAllocationDialogOpen, setIsInvestigatorAllocationDialogOpen] = useState<boolean>(false);

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
        sortInvestigationTable, changeGroupsDesk, changeInvestigationsDesk, changeGroupsCounty, changeInvestigationCounty,
        getNestedCellStyle, getRegularCellStyle,
        moveToTheInvestigationForm, totalCount, unassignedInvestigationsCount,
        fetchInvestigationsByGroupId, fetchTableData, changeGroupsInvestigator, changeInvestigationsInvestigator,
        statusFilter, subStatusFilter, changeStatusFilter, changeSubStatusFilter, deskFilter, changeDeskFilter, changeSearchFilter,
        changeUnassginedUserFilter, unassignedUserFilter, changeInactiveUserFilter, inactiveUserFilter, fetchAllCountyUsers,
        tableTitle, timeRangeFilter, isBadgeInVisible, changeTimeRangeFilter,updateDateFilter, nonContactFilter
    } = useInvestigationTable({
        setSelectedRow, allGroupedInvestigations, setAllStatuses, currentPage, setCurrentPage, setAllGroupedInvestigations,
        investigationColor, setAllSubStatuses
    });

    const user = useSelector<StoreStateType, User>(state => state.user.data);

    const { countyDesks, displayedCounty } = useDesksUtils();

    const desksToTransfer : Desk[] = useMemo(() =>
        [...countyDesks, { id: null, deskName: 'לא שוייך לדסק', county: displayedCounty}]
    , [countyDesks])

    const totalPageCount = Math.ceil(totalCount / rowsPerPage);

    const isRowSelected = (epidemiologyNumber: number) => checkedIndexedRows.map(indexedRow => indexedRow.epidemiologyNumber).includes(epidemiologyNumber);

    const handleCellClick = (event: any, key: string, epidemiologyNumber: number, groupId: string) => {
        switch (key) {
            case TableHeadersNames.investigatorName: {
                event.stopPropagation();
                setIsInvestigatorAllocationDialogOpen(true);
                setDeskAutoCompleteClicked(false);
                break;
            }
            case TableHeadersNames.investigationDesk: {
                event.stopPropagation();
                setDeskAutoCompleteClicked(true);
                break;
            }
        }
        setSelectedRow({ epidemiologyNumber, groupId });
        setCheckedIndexedRows([]);
    }

    const getFilteredUsersOfCurrentCounty = async (): Promise<InvestigatorOption[]> => {
        const allCountyUsers = await fetchAllCountyUsers();
        const allUsersOfCountyArray: InvestigatorOption[] = Array.from(allCountyUsers, ([id, value]) => ({ id, value }));

        if (deskFilter.length > 0) {
            return allUsersOfCountyArray.filter(({ value }) => {
                const { deskid } = value;
                const filterHasNotAssigned = deskFilter.some(desk => desk === null);
                if (!deskid) {
                    return filterHasNotAssigned;
                }
                return deskFilter.indexOf(deskid) !== -1;
            });
        }
        return allUsersOfCountyArray;
    }

    const allocateInvestigationToInvestigator = async (groupIds: string[], epidemiologyNumbers: number[], investigatorToAllocate: InvestigatorOption) => {
        if (groupIds.length && groupIds[0]) {
            await changeGroupsInvestigator(groupIds, investigatorToAllocate)
        }
        if (epidemiologyNumbers) {
            await changeInvestigationsInvestigator(epidemiologyNumbers, investigatorToAllocate);
        }
        groupIds[0] && groupIds.forEach((groupId: string) => fetchInvestigationsByGroupId(groupId));
        fetchTableData();
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

    const isInvestigationRowClickable = (investigationStatus: InvestigationMainStatus) =>
        !(user.userType === userType.INVESTIGATOR && investigationStatus.id === InvestigationMainStatusCodes.DONE)

    const counterDescription: string = useMemo(() => {
        const adminMessage = `, ${unassignedInvestigationsCount} לא מוקצות`;
        return `${totalCount} חקירות סה"כ${(user.userType === userType.ADMIN || user.userType === userType.SUPER_ADMIN) ? adminMessage : ``}`;

    }, [tableRows, unassignedInvestigationsCount]);

    const alertInvestigationDeskChange = (indexedRow: { [T in keyof typeof TableHeadersNames]: any }) =>
        async (event: React.ChangeEvent<{}>, newSelectedDesk: Desk | null) => {
            const deskName = newSelectedDesk?.deskName;
            const { investigationDesk, epidemiologyNumber, groupId } = indexedRow;

            const switchDeskTitle = `<p>האם אתה בטוח שאתה רוצה להחליף את דסק <b>${investigationDesk}</b> בדסק <b>${deskName}</b>?</p>`;
            const enterDeskTitle = `<p>האם אתה בטוח שאתה רוצה לבחור את דסק <b>${deskName}</b>?</p>`;
            if (deskName !== investigationDesk) {
                const result = await alertWarning(investigationDesk ? switchDeskTitle : enterDeskTitle, {
                    showCancelButton: true,
                    cancelButtonText: 'לא',
                    cancelButtonColor: theme.palette.error.main,
                    confirmButtonColor: theme.palette.primary.main,
                    confirmButtonText: 'כן, המשך',
                });
                if (result.isConfirmed) {
                    groupId ?
                        await changeGroupsDesk([groupId], newSelectedDesk) :
                        await changeInvestigationsDesk([epidemiologyNumber], newSelectedDesk);
                    fetchTableData();
                    if(groupId){
                        fetchInvestigationsByGroupId(groupId);
                    }
                }

                setSelectedRow(DEFAULT_SELECTED_ROW);
            }
        }

    useEffect(() => {
        window.addEventListener("keydown", handleEscKey);
        return () => {
            window.removeEventListener("keydown", handleEscKey);
        };
    }, []);

    const handleEscKey = (e: KeyboardEvent) => {
        e.key === 'Escape' && closeDropdowns()
    }

    return (
        <div onClick={closeDropdowns} >
            <Grid className={classes.title} container alignItems='center'>
                <Grid container xs={9} direction='row' alignItems='center'>
                    {
                        (user.userType === userType.ADMIN || user.userType === userType.SUPER_ADMIN) &&
                        <Tooltip title={returnToAdminLandingPage}>
                            <IconButton color='primary' onClick={() => history.push(adminLandingPageRoute , { deskFilter, timeRangeFilter })}>
                                <ArrowForward />
                            </IconButton>
                        </Tooltip>
                    }
                    <Typography color='textPrimary' className={classes.welcomeMessage}>
                        {tableTitle}
                    </Typography>
                </Grid>
                <Grid item xs={2} >
                    <DeskFilter
                        desks={desksToTransfer}
                        filteredDesks={deskFilter}
                        onFilterChange={(event, value) => changeDeskFilter(value)} 
                    />
                </Grid>
            </Grid>
            <Grid className={classes.content}>
                <div className={classes.tableHeaderRow}>
                    <Typography color='primary' className={classes.counterLabel} >
                        {counterDescription}
                    </Typography>
                    <Box justifyContent='flex-end' display='flex'>
                        <SearchBar 
                            validationSchema={stringAlphanum}
                            searchBarLabel={searchBarLabel}
                            onClick={(value: string) => changeSearchFilter(value)}
                        />
                        <Tooltip title='סינון'>
                            <IconButton 
                                color='primary'
                                onClick={toggleFilterRow} 
                            >
                                <Badge
                                    invisible={isBadgeInVisible}
                                    color='error'
                                    variant='dot'
                                    anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                                >
                                    <FontAwesomeIcon icon={faFilter} style={{ fontSize: '15px' }} />
                                </Badge>
                            </IconButton>
                        </Tooltip>
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
                    <Grid item xs={12}>
                        <Collapse in={showFilterRow}>
                            <TableFilter
                                statuses={allStatuses}
                                subStatuses={allSubStatuses}
                                filteredStatuses={statusFilter}
                                onFilterChange={(event, value) => changeStatusFilter(value)}
                                onClose={closeFilterRow}
                                filteredSubStatuses={subStatusFilter}
                                onSubStatusChange={(event, value) => changeSubStatusFilter(value)}
                                changeInactiveUserFilter={changeInactiveUserFilter}
                                changeUnassginedUserFilter={changeUnassginedUserFilter}
                                inactiveUserFilter={inactiveUserFilter}
                                unassignedUserFilter={unassignedUserFilter}
                                timeRangeFilter={timeRangeFilter}
                                onTimeRangeFilterChange={changeTimeRangeFilter}
                                updateDateFilter={updateDateFilter}
                                nonContactFilter={nonContactFilter} 
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
                            {tableRows.map((row: InvestigationTableRowType, index: number) => {
                                const indexedRow = convertToIndexedRow(row);
                                const isRowClickable = isInvestigationRowClickable(row.mainStatus);
                                const isGroupShown = checkGroupedInvestigationOpen.includes(indexedRow.epidemiologyNumber);

                                return (
                                    <>
                                        <InvestigationTableRow
                                            columns={(user.userType === userType.ADMIN || user.userType === userType.SUPER_ADMIN) ? adminCols : userCols}
                                            groupColor={investigationColor.current.get(indexedRow.groupId)}
                                            selected={selectedRow.epidemiologyNumber === indexedRow.epidemiologyNumber}
                                            deskAutoCompleteClicked={deskAutoCompleteClicked}
                                            desks={desksToTransfer}
                                            indexedRow={indexedRow}
                                            row={row}
                                            isGroupShown={isGroupShown}
                                            checked={isRowSelected(indexedRow.epidemiologyNumber)}
                                            clickable={isRowClickable}
                                            tableContainerRef={tableContainerRef}
                                            allGroupedInvestigations={allGroupedInvestigations}
                                            checkGroupedInvestigationOpen={checkGroupedInvestigationOpen}
                                            tableCellStyleFunction={getRegularCellStyle(index, isGroupShown)}
                                            onInvestigationDeskChange={alertInvestigationDeskChange(indexedRow)}
                                            onInvestigationRowClick={onInvestigationRowClick}
                                            onCellClick={handleCellClick}
                                            fetchTableData={fetchTableData}
                                            fetchInvestigationsByGroupId={fetchInvestigationsByGroupId}
                                            moveToTheInvestigationForm={moveToTheInvestigationForm}
                                            onMultiCheckClick={(event) => {
                                                event.stopPropagation();
                                                markRow(indexedRow);
                                            }}
                                            onGroupExpandClick={async (event) => {
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
                                            }}
                                        />
                                        {checkGroupedInvestigationOpen.includes(indexedRow.epidemiologyNumber) &&
                                            allGroupedInvestigations.get(indexedRow.groupId)?.filter((row: InvestigationTableRowType) => row.epidemiologyNumber !== indexedRow.epidemiologyNumber).map((row: InvestigationTableRowType, index: number) => {
                                                const currentGroupedInvestigationsLength = allGroupedInvestigations.get(indexedRow.groupId)?.length! - 1; // not including row head
                                                const indexedGroupedInvestigationRow = convertToIndexedRow(row);
                                                const isGroupedRowClickable = isInvestigationRowClickable(row.mainStatus);
                                                return (
                                                    <InvestigationTableRow
                                                        columns={(user.userType === userType.ADMIN || user.userType === userType.SUPER_ADMIN) ? adminCols : userCols}
                                                        groupColor={investigationColor.current.get(indexedRow.groupId)}
                                                        selected={selectedRow.epidemiologyNumber === indexedRow.epidemiologyNumber}
                                                        deskAutoCompleteClicked={deskAutoCompleteClicked}
                                                        desks={desksToTransfer}
                                                        indexedRow={indexedGroupedInvestigationRow}
                                                        row={row}
                                                        isGroupShown={isGroupShown}
                                                        checked={isRowSelected(indexedRow.epidemiologyNumber)}
                                                        clickable={isGroupedRowClickable}
                                                        disabled={displayedCounty !== row.county.id}
                                                        tableContainerRef={tableContainerRef}
                                                        allGroupedInvestigations={allGroupedInvestigations}
                                                        checkGroupedInvestigationOpen={checkGroupedInvestigationOpen}
                                                        fetchTableData={fetchTableData}
                                                        fetchInvestigationsByGroupId={fetchInvestigationsByGroupId}
                                                        moveToTheInvestigationForm={moveToTheInvestigationForm}
                                                        tableCellStyleFunction={getNestedCellStyle(index + 1 === currentGroupedInvestigationsLength)}
                                                        onInvestigationDeskChange={alertInvestigationDeskChange(indexedRow)}
                                                        onInvestigationRowClick={onInvestigationRowClick}
                                                        onCellClick={handleCellClick}
                                                    />
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
            <InvestigatorAllocationDialog
                isOpen={isInvestigatorAllocationDialogOpen}
                handleCloseDialog={() => setIsInvestigatorAllocationDialogOpen(false)}
                fetchInvestigators={getFilteredUsersOfCurrentCounty}
                allocateInvestigationToInvestigator={allocateInvestigationToInvestigator}
                groupIds={[selectedRow.groupId]}
                epidemiologyNumbers={[selectedRow.epidemiologyNumber]}
                onSuccess={onAllocationSuccess}
            />
            <Slide direction='up' in={checkedIndexedRows.length > 0} mountOnEnter unmountOnExit>
                <InvestigationTableFooter
                    checkedIndexedRows={checkedIndexedRows}
                    allDesks={desksToTransfer}
                    onDialogClose={() => setCheckedIndexedRows([])}
                    tableRows={tableRows}
                    fetchTableData={fetchTableData}
                    onDeskGroupChange={changeGroupsDesk}
                    onDeskChange={changeInvestigationsDesk}
                    onCountyChange={changeInvestigationCounty}
                    onCountyGroupChange={changeGroupsCounty}
                    allGroupedInvestigations={allGroupedInvestigations}
                    fetchInvestigationsByGroupId={fetchInvestigationsByGroupId}
                    fetchInvestigators={getFilteredUsersOfCurrentCounty}
                    allocateInvestigationToInvestigator={allocateInvestigationToInvestigator}
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
