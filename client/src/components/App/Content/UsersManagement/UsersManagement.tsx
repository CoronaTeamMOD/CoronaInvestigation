import React, { useState } from 'react';
import {
    Grid, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody,
    IconButton, Tooltip, TableSortLabel, Badge, Typography, Collapse, MenuItem, Select
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { PersonPin } from '@material-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

import Desk from 'models/Desk';
import SortOrder from 'models/enums/SortOrder';
import IsActiveToggle from 'commons/IsActiveToggle/IsActiveToggle';
import { get } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';

import { UsersManagementTableHeaders, UsersManagementTableHeadersNames } from './UsersManagementTableHeaders';
import useStyles from './UsersManagementStyles';
import SearchBar from './UsersFilter/SearchBar';
import useUsersManagementTable from './useUsersManagement';
import UserInfoDialog from './UserInfoDialog/UserInfoDialog';
import UsersFilter from './UsersFilter/UsersFilter';
import filterCreators from './UsersFilter/FilterCreators';

const rowsPerPage: number = 100;
export const defaultPage: number = 1;

interface CellNameSort {
    name: string;
    direction: SortOrder | undefined;
}

const usersManagementTitle = 'ניהול משתמשים';
const sourceOrganizationLabel = 'מסגרת';
const notActiveSortFields: string[] = [UsersManagementTableHeadersNames.WATCH, UsersManagementTableHeadersNames.LANGUAGES,
UsersManagementTableHeadersNames.COUNTY, UsersManagementTableHeadersNames.USER_TYPE,
UsersManagementTableHeadersNames.DESK];

const UsersManagement: React.FC = () => {
    const [page, setPage] = useState<number>(defaultPage);
    const [cellNameSort, setCellNameSort] = useState<CellNameSort>({ name: '', direction: undefined });
    const [isFilterOpen, setIsFilterOpen] = React.useState<boolean>(false);

    const { users, counties, desks, sourcesOrganization, userTypes, languages,
            totalCount, userDialog, isBadgeInVisible, watchUserInfo, handleCloseDialog, handleFilterChange, setUserActivityStatus,
            setUserSourceOrganization, setUserDesk } =
            useUsersManagementTable({ page, rowsPerPage, cellNameSort, setPage });

    const totalPages: number = Math.ceil(totalCount / rowsPerPage);

    const classes = useStyles();

    const handleSortOrder = (cellName: string) => {
        if (!notActiveSortFields.includes(cellName)) {
            setCellNameSort({
                name: cellName,
                direction: cellNameSort.name !== cellName ? SortOrder.asc :
                    cellNameSort.direction === SortOrder.asc ? SortOrder.desc : SortOrder.asc
            });
        }
    }

    const getTableCell = (row: any, cellName: string) => {
        switch (cellName) {
            case UsersManagementTableHeadersNames.LANGUAGES: {
                return row[cellName]?.join(', ')
            }
            case UsersManagementTableHeadersNames.USER_STATUS: {
                return (
                    <IsActiveToggle
                        value={row[cellName]}
                        onToggle={(isActive) => setUserActivityStatus(isActive, row[UsersManagementTableHeadersNames.MABAR_USER_NAME])}
                    />
                )
            }
            case UsersManagementTableHeadersNames.WATCH: {
                return (
                    <Tooltip title='צפייה בפרטי המשתמש'>
                        <IconButton onClick={() => watchUserInfo(row)}>
                            <PersonPin />
                        </IconButton>
                    </Tooltip>
                )
            }
            case UsersManagementTableHeadersNames.DESK: {
                return (
                    <Select
                        MenuProps={{
                            anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'left'
                            },
                            transformOrigin: {
                                vertical: 'top',
                                horizontal: 'left'
                            },
                            getContentAnchorEl: null
                        }}
                        value={row[cellName]?.id || ''}
                        onChange={(event: React.ChangeEvent<any>) => setUserDesk(event.target.value as number, row[UsersManagementTableHeadersNames.MABAR_USER_NAME])}
                        className={classes.desks}
                        variant='outlined'
                    >
                        {
                            desks.map((desk: Desk) => (
                                <MenuItem
                                    key={desk.id}
                                    value={desk.id}>
                                    {desk.deskName}
                                </MenuItem>
                            ))
                        }
                    </Select>
                )
                
            }
            case UsersManagementTableHeadersNames.SOURCE_ORGANIZATION : {
                return (
                    <Select
                        MenuProps={{
                            anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'left'
                            },
                            transformOrigin: {
                                vertical: 'top',
                                horizontal: 'left'
                            },
                            getContentAnchorEl: null
                        }}
                        value={row.sourceOrganization  || ''}
                        onChange={(event: React.ChangeEvent<any>) => setUserSourceOrganization(event.target.value as string, row[UsersManagementTableHeadersNames.MABAR_USER_NAME])}
                        label={sourceOrganizationLabel}
                        variant='outlined'
                        className={classes.sourceOrganization}
                    >
                        {
                            sourcesOrganization.map(sourceOrganization => (
                                <MenuItem
                                    key={sourceOrganization.displayName}
                                    value={sourceOrganization.displayName}>
                                    {sourceOrganization.displayName}
                                </MenuItem>
                            ))
                        }
                    </Select>
                )
            }
            default:
                return row[cellName]
        }
    }

    return (
        <Grid className={classes.content}>
            <Grid>
                <Typography color='textPrimary' className={classes.header}>
                    {usersManagementTitle}
                </Typography>
            </Grid>
            <Grid container justify='space-between' className={classes.filters}>
                <SearchBar 
                    onClick={(value: string) => handleFilterChange(filterCreators.USER_NAME_OR_ID.create(value))}
                />
                <Tooltip title='סינון'>
                    <IconButton onClick={() => setIsFilterOpen(true)}>
                        <Badge
                            invisible={isBadgeInVisible}
                            color='error'
                            variant='dot'
                            anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                        >
                            <FontAwesomeIcon icon={faFilter} />
                        </Badge>
                    </IconButton>
                </Tooltip>
            </Grid>
            <Collapse in={isFilterOpen} style={{ minHeight: 'unset' }}>
                <Paper className={classes.filtersContent}>
                    <UsersFilter
                        sourcesOrganization={sourcesOrganization}
                        languages={languages}
                        counties={counties}
                        userTypes={userTypes}
                        handleFilterChange={handleFilterChange}
                        handleCloseFitler={() => setIsFilterOpen(false)}
                    />
                </Paper>
            </Collapse>
            <TableContainer component={Paper} className={classes.tableContainer}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {
                                Object.keys(UsersManagementTableHeaders).map(cellName => {
                                    return (
                                        <TableCell>
                                            <TableSortLabel
                                                active={!notActiveSortFields.includes(cellName)}
                                                hideSortIcon
                                                direction={cellName === cellNameSort.name ? cellNameSort.direction : SortOrder.asc}
                                                onClick={() => handleSortOrder(cellName)}
                                                classes={{ root: cellName === cellNameSort.name ? classes.activeSortIcon : '', icon: classes.icon, active: classes.active }}
                                            >
                                                {get(UsersManagementTableHeaders, cellName)}
                                            </TableSortLabel>
                                        </TableCell>
                                    )
                                })
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            users.map((user: any) => (
                                <TableRow>
                                    {
                                        Object.keys(UsersManagementTableHeaders).map(cellName => (
                                            <TableCell>
                                                {
                                                    getTableCell(user, cellName)
                                                }
                                            </TableCell>
                                        ))
                                    }
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <Pagination
                count={totalPages}
                page={page}
                onChange={(event, value) => setPage(value)}
                size='large'
                className={classes.pagination}
            />
            <UserInfoDialog
                open={userDialog.isOpen}
                defaultValues={userDialog.info}
                handleCloseDialog={handleCloseDialog}
            />
        </Grid>
    );
};

export default UsersManagement;
