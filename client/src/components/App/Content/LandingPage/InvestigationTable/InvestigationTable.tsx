import { useSelector } from 'react-redux';
import { Pagination } from '@material-ui/lab';
import {
    Paper, Table, TableRow, TableBody, TableCell, Typography,
    TableHead, TableContainer, TableSortLabel, Button,
    useMediaQuery, Collapse, IconButton, Grid,
    Slide, Popover, Tooltip, Checkbox
} from '@material-ui/core';
import React, { useMemo, useState, useRef, useEffect } from 'react';
import { KeyboardArrowDown, KeyboardArrowLeft, Refresh } from '@material-ui/icons';

import Desk from 'models/Desk';
import User from 'models/User';
import SubStatus from 'models/SubStatus';
import SortOrder from 'models/enums/SortOrder';
import StoreStateType from 'redux/storeStateType';
import useDesksUtils from 'Utils/Desk/useDesksUtils';
import UserTypeCodes from 'models/enums/UserTypeCodes';
import InvestigatorOption from 'models/InvestigatorOption';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import InvestigationTableRowType from 'models/InvestigationTableRow';
import InvestigationMainStatus from 'models/InvestigationMainStatus';
import RefreshSnackbar from 'commons/RefreshSnackbar/RefreshSnackbar';
import InvestigationMainStatusCodes from 'models/enums/InvestigationMainStatusCodes';

import useStyles from './InvestigationTableStyles';
import TableFilter from './TableFilter/TableFilter';
import AdminMessages from './adminMessages/adminMessages';
import InvestigationTableRow from './InvestigationTableRow/InvestigationTableRow';
import InvestigationTableFooter from './InvestigationTableFooter/InvestigationTableFooter';
import InvestigatorAllocationDialog from './InvestigatorAllocation/InvestigatorAllocationDialog';
import useInvestigationTable, { SelectedRow, DEFAULT_SELECTED_ROW } from './useInvestigationTable';
import { TableHeadersNames, TableHeaders, adminCols, userCols, Order, sortableCols, IndexedInvestigation } from './InvestigationTablesHeaders';
import { setIsViewMode } from 'redux/Investigation/investigationActionCreators';

export const defaultOrderBy = 'defaultOrder';
export const defaultPage = 1;
export const rowsPerPage = 100;

const refreshPromptMessage = 'שים לב, ייתכן כי התווספו חקירות חדשות';
const emptyGroupText = 'שים לב, בסבירות גבוהה לחקירה זו קובצו חקירות ישנות שכבר לא קיימות במערכת'
const resetSortButtonText = 'סידור לפי תעדוף';
const selectAllText = 'בחר הכל';

const InvestigationTable: React.FC = (): JSX.Element => {
    const isScreenWide = useMediaQuery('(min-width: 1680px)');
    const classes = useStyles(isScreenWide);
    const { alertSuccess } = useCustomSwal();
    const onAllocationSuccess = () => alertSuccess('החוקר הוקצה בהצלחה');

    const [checkedIndexedRows, setCheckedIndexedRows] = useState<IndexedInvestigation[]>([]);
    const [selectedRow, setSelectedRow] = useState<SelectedRow>(DEFAULT_SELECTED_ROW);
    const [deskAutoCompleteClicked, setDeskAutoCompleteClicked] = useState<boolean>(false);
    const [order, setOrder] = useState<Order>(SortOrder.asc);
    const [orderBy, setOrderBy] = useState<string>(defaultOrderBy);
    const [allStatuses, setAllStatuses] = useState<InvestigationMainStatus[]>([]);
    const [allSubStatuses, setAllSubStatuses] = useState<SubStatus[]>([]);
    const [allComplexReasons, setAllComplexReasons] = useState<(number | null)[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(defaultPage);
    const [checkGroupedInvestigationOpen, setCheckGroupedInvestigationOpen] = useState<number[]>([])
    const [allGroupedInvestigations, setAllGroupedInvestigations] = useState<Map<string, InvestigationTableRowType[]>>(new Map());
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [shouldOpenPopover, setShouldOpenPopover] = useState<boolean>(false);
    const [isInvestigatorAllocationDialogOpen, setIsInvestigatorAllocationDialogOpen] = useState<boolean>(false);
    const [isGroupedExpanded, setIsGroupedExpanded] = useState<boolean>(false);

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
        tableTitle, timeRangeFilter, isBadgeInVisible, changeTimeRangeFilter, updateDateFilter, nonContactFilter, fetchAllGroupedInvestigations,
        unallocatedDeskFilter, changeUnallocatedDeskFilter, changeInvestigatorReferenceStatusFilter,
        changeInvestigatorReferenceRequiredFilter, investigatorReferenceRequiredFilter, investigatorReferenceStatusFilter,
        chatStatusFilter, changeChatStatusFilter, incompletedBotInvestigationFilter, changeIncompletedBotInvestigationFilter,
        complexityFilter, changeComplexityFilter, complexityReasonFilter,changeComplexityReasonFilter
    } = useInvestigationTable({
        setSelectedRow, allGroupedInvestigations, setAllStatuses, currentPage, setCurrentPage, setAllGroupedInvestigations,
        investigationColor, setAllSubStatuses, setAllComplexReasons
    });

    const user = useSelector<StoreStateType, User>(state => state.user.data);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const { countyDesks, displayedCounty } = useDesksUtils();

    const desksToTransfer: Desk[] = useMemo(() =>
        [...countyDesks, { id: null, deskName: 'לא שוייך לדסק', county: displayedCounty }]
        , [countyDesks]);

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
    };

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
    };

    const allocateInvestigationToInvestigator = async (groupIds: string[], epidemiologyNumbers: number[], investigatorToAllocate: InvestigatorOption) => {
        if (groupIds.length && groupIds[0]) {
            await changeGroupsInvestigator(groupIds, investigatorToAllocate, '')
        }
        if (epidemiologyNumbers.length > 0) {
            await changeInvestigationsInvestigator(epidemiologyNumbers, investigatorToAllocate);
        }
        groupIds[0] && groupIds.forEach((groupId: string) => fetchInvestigationsByGroupId(groupId));
        fetchTableData();
    };

    const handleRequestSort = (event: any, property: React.SetStateAction<string>) => {
        const isAsc = orderBy === property && order === SortOrder.asc;
        const newOrder = isAsc ? SortOrder.desc : SortOrder.asc;
        setOrder(newOrder);
        setOrderBy(property);
        property === defaultOrderBy ? sortInvestigationTable(property) : sortInvestigationTable(property + newOrder.toLocaleUpperCase());
    };

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
    };

    const openGroupedInvestigation = (epidemiologyNumber: number, groupId: string) => {
        checkGroupedInvestigationOpen.includes(epidemiologyNumber) ?
            setCheckGroupedInvestigationOpen(checkGroupedInvestigationOpen.filter(rowId => rowId !== epidemiologyNumber)) :
            setCheckGroupedInvestigationOpen([...checkGroupedInvestigationOpen, epidemiologyNumber])
    };

    const expandAllGroupedInvestigations = async () => {
        await fetchAllGroupedInvestigations();

        const InvestigationsToExpand = Array.from(allGroupedInvestigations)
            .flatMap(groupedInvestigations => groupedInvestigations[1]
                .map(investigation => investigation.epidemiologyNumber)
            )
        setIsGroupedExpanded(true);
        setCheckGroupedInvestigationOpen(InvestigationsToExpand);
    };

    const collapseAllGroupedInvestigations = async () => {
        setIsGroupedExpanded(false);
        setCheckGroupedInvestigationOpen([]);
    };

    const isInvestigationRowClickable = (investigationStatus: InvestigationMainStatus) =>
        !(user.userType === UserTypeCodes.INVESTIGATOR && investigationStatus.id === InvestigationMainStatusCodes.DONE)

    const counterDescription: string = useMemo(() => {
        const adminMessage = `, ${unassignedInvestigationsCount} לא מוקצות`;
        return `${totalCount} חקירות סה"כ${(user.userType === UserTypeCodes.ADMIN || user.userType === UserTypeCodes.SUPER_ADMIN) ? adminMessage : ``}`;

    }, [tableRows, unassignedInvestigationsCount]);

    const alertInvestigationDeskChange = (indexedRow: { [T in keyof typeof TableHeadersNames]: any }) =>
        async (event: React.ChangeEvent<{}>, newSelectedDesk: Desk | null) => {
            const deskName = newSelectedDesk?.deskName;
            const { investigationDesk, epidemiologyNumber, groupId } = indexedRow;
            if (deskName !== investigationDesk) {
                groupId ?
                    await changeGroupsDesk([groupId], newSelectedDesk) :
                    await changeInvestigationsDesk([epidemiologyNumber], newSelectedDesk);
                setSelectedRow(DEFAULT_SELECTED_ROW);
                fetchTableData();
            }
        };
    
    const onSelectAllClick = () => {
        if (!selectAll) {
            const selectedRows = tableRows.map((row: InvestigationTableRowType) =>
                convertToIndexedRow(row)
            );
            setCheckedIndexedRows(selectedRows);
        }
        else {
            setCheckedIndexedRows([]);
        }
        setSelectAll(!selectAll);
    }
    const onSelectedInvsDialogClose = () => {
        setSelectAll(false);
        setCheckedIndexedRows([]);
    }
    useEffect(() => {
        window.addEventListener('keydown', handleEscKey);
        return () => {
            window.removeEventListener('keydown', handleEscKey);
        };
    }, []);

    const handleEscKey = (e: KeyboardEvent) => {
        e.key === 'Escape' && closeDropdowns()
    };

    return (
        <div onClick={closeDropdowns} >
            <Grid className={classes.content}>
                <Grid container justify='flex-end' alignItems='center' className={classes.filterTableRow}>
                    <Grid item xs={12}>
                        <AdminMessages
                            deskFilter={deskFilter}
                        />
                    </Grid>
                </Grid>
                <div className={classes.tableHeaderRow}>
                    <Typography color='primary' className={classes.counterLabel} >
                        {counterDescription}
                    </Typography>
                </div>
                <Grid container justify='flex-end' alignItems='center' className={classes.filterTableRow}>
                    <Grid item xs={12}>
                        <TableFilter
                            statuses={allStatuses}
                            subStatuses={allSubStatuses}
                            filteredStatuses={statusFilter}
                            onFilterChange={changeStatusFilter}
                            filteredSubStatuses={subStatusFilter}
                            onSubStatusChange={changeSubStatusFilter}
                            changeInactiveUserFilter={changeInactiveUserFilter}
                            changeUnassginedUserFilter={changeUnassginedUserFilter}
                            inactiveUserFilter={inactiveUserFilter}
                            unassignedUserFilter={unassignedUserFilter}
                            timeRangeFilter={timeRangeFilter}
                            onTimeRangeFilterChange={changeTimeRangeFilter}
                            updateDateFilter={updateDateFilter}
                            nonContactFilter={nonContactFilter}
                            desksToTransfer={desksToTransfer}
                            deskFilter={deskFilter}
                            changeDeskFilter={changeDeskFilter}
                            handleRequestSort={handleRequestSort}
                            changeSearchFilter={changeSearchFilter}
                            unallocatedDeskFilter={unallocatedDeskFilter}
                            changeUnallocatedDeskFilter={changeUnallocatedDeskFilter}
                            changeInvestigatorReferenceStatusFilter={changeInvestigatorReferenceStatusFilter}
                            investigatorReferenceRequiredFilter={investigatorReferenceRequiredFilter}
                            changeInvestigatorReferenceRequiredFilter={changeInvestigatorReferenceRequiredFilter}
                            investigatorReferenceStatusFilter={investigatorReferenceStatusFilter}
                            changeChatStatusFilter={changeChatStatusFilter}
                            chatStatusFilter={chatStatusFilter}
                            incompletedBotInvestigationFilter={incompletedBotInvestigationFilter}
                            changeIncompletedBotInvestigationFilter={changeIncompletedBotInvestigationFilter}
                            complexityFilter= {complexityFilter}
                            changeComplexityFilter= {changeComplexityFilter}
                            complexityReasonFilter={complexityReasonFilter}
                            changeComplexityReasonFilter={changeComplexityReasonFilter}
                        />
                    </Grid>
                </Grid>
                <TableContainer ref={tableContainerRef} component={Paper} className={classes.tableContainer}>
                    <Table aria-label='simple table' stickyHeader id='LandingPageTable'>
                        <TableHead>
                            <TableRow>
                                {
                                    Object.values((user.userType === UserTypeCodes.ADMIN || user.userType === UserTypeCodes.SUPER_ADMIN) ? adminCols : userCols).map((key) => (
                                        <TableCell
                                            classes={{ stickyHeader: classes.horizontalSticky }}
                                            className={classes.tableHeaderCell + ' ' + (key === TableHeadersNames.investigatorName || key === TableHeadersNames.investigatiorReferenceRequired ? classes.columnBorder : '')}
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
                                            {
                                                key === TableHeadersNames.multipleCheck &&
                                                <>
                                                    {
                                                       (user.userType !== UserTypeCodes.INVESTIGATOR) &&
                                                        <Tooltip title={selectAllText} placement='top' arrow>
                                                            <Checkbox onClick={onSelectAllClick} color='primary' checked={selectAll} size='small' />
                                                        </Tooltip>
                                                    }
                                                    <Tooltip title={(isGroupedExpanded ? 'הסתר' : 'הצג') + ' ' + 'את כל החקירות המקושרות'} placement='top' arrow>
                                                        <IconButton onClick={
                                                            isGroupedExpanded ? collapseAllGroupedInvestigations : expandAllGroupedInvestigations
                                                        }>
                                                            {isGroupedExpanded ?
                                                                <KeyboardArrowDown /> :
                                                                <KeyboardArrowLeft />}
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title={resetSortButtonText} placement='top' arrow>
                                                        <Button
                                                            color='primary'
                                                            className={classes.sortResetButton}
                                                            startIcon={<Refresh />}
                                                            onClick={(event: any) => handleRequestSort(event, defaultOrderBy)}
                                                        >
                                                        </Button>
                                                    </Tooltip>
                                                   
                                                </>
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
                                            complexityReasonsId={row.complexityReasonsId}
                                            columns={(user.userType === UserTypeCodes.ADMIN || user.userType === UserTypeCodes.SUPER_ADMIN) ? adminCols : userCols}
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
                                            onInvestigationRowClick={() => {
                                                setIsViewMode(false);
                                                onInvestigationRowClick(indexedRow)
                                            }}
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
                                            onSetViewMode={event => {
                                                event.stopPropagation();
                                                setIsViewMode(true);
                                                onInvestigationRowClick(indexedRow)
                                            }}
                                        />
                                        {checkGroupedInvestigationOpen.includes(indexedRow.epidemiologyNumber) &&
                                            allGroupedInvestigations.get(indexedRow.groupId)?.filter((row: InvestigationTableRowType) => row.epidemiologyNumber !== indexedRow.epidemiologyNumber).map((row: InvestigationTableRowType, index: number) => {
                                                const currentGroupedInvestigationsLength = allGroupedInvestigations.get(indexedRow.groupId)?.length! - 1; // not including row head
                                                const indexedGroupedInvestigationRow = convertToIndexedRow(row);
                                                const isGroupedRowClickable = isInvestigationRowClickable(row.mainStatus);
                                                return (
                                                    <InvestigationTableRow
                                                        complexityReasonsId={row.complexityReasonsId}
                                                        columns={(user.userType === UserTypeCodes.ADMIN || user.userType === UserTypeCodes.SUPER_ADMIN) ? adminCols : userCols}
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
                    onChange={(event, value) => {
                        setCurrentPage(value);
                        window.scrollTo(0, 0);
                        tableContainerRef.current?.scrollTo(0, 0);
                    }}
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
                isGroupedContact={false}
            />
            <Slide direction='up' in={checkedIndexedRows.length > 0} mountOnEnter unmountOnExit>
                <InvestigationTableFooter
                    checkedIndexedRows={checkedIndexedRows}
                    allDesks={desksToTransfer}
                    onDialogClose={onSelectedInvsDialogClose}
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
};

export default InvestigationTable;
