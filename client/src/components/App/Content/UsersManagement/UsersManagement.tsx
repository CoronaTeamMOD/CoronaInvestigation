import React, { useState } from 'react';
import {
    Grid, TextField, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody,
    IconButton, Tooltip, TableSortLabel, Badge, Collapse, Typography, InputAdornment
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { PersonPin, Search } from '@material-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

import SortOrder from 'models/enums/SortOrder';
import IsActiveToggle from 'commons/IsActiveToggle/IsActiveToggle';
import { get } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';

import { UsersManagementTableHeaders, UsersManagementTableHeadersNames } from './UsersManagementTableHeaders';
import useStyles from './UsersManagementStyles';
import useUsersManagementTable from './useUsersManagement';
import UserInfoDialog from './UserInfoDialog/UserInfoDialog';
import UsersFilter from './UsersFilter/UsersFilter';

const rowsPerPage: number = 7;
interface CellNameSort {
    name: string;
    direction: SortOrder | undefined;
}

const UsersManagement: React.FC = () => {
    const [page, setPage] = useState<number>(1);
    const [cellNameSort, setCellNameSort] = useState<CellNameSort>({ name: '', direction: undefined });
    const [anchorEl, setAnchorEl] = React.useState(null);

    const { users, counties, sourcesOrganization, userTypes, languages, totalCount, userDialog, watchUserInfo, handleCloseDialog } =
        useUsersManagementTable({ page, rowsPerPage, cellNameSort });

    const refreshPromptMessage = 'ניהול משתמשים';
    const searchUserPlaceHolder = 'חפש שם או שם משתמש...';

    const totalPages: number = Math.ceil(totalCount / rowsPerPage);

    const classes = useStyles();

    const handleSortOrder = (cellName: string) => {
        setCellNameSort({
            name: cellName,
            direction: cellNameSort.direction === SortOrder.asc ? SortOrder.desc : SortOrder.asc
        });
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
                        setUserActivityStatus={(isActive: boolean) => console.log(isActive)}
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
            default:
                return row[cellName]
        }
    }

    return (
        <Grid className={classes.content}>
            <Grid>
                <Typography color='textPrimary' className={classes.header}>
                    {refreshPromptMessage}
                </Typography>
            </Grid>
            <Grid container className={classes.filters}>
                <TextField
                    placeholder={searchUserPlaceHolder}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                    className={classes.userFilter} />
                <Tooltip title='סינון' className={classes.filterIcon}>
                    <IconButton onClick={(event: any) => setAnchorEl(anchorEl ? null : event.currentTarget)}>
                        <Badge
                            invisible={false}
                            color='primary'
                            variant='dot'
                            anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                        >
                            <FontAwesomeIcon icon={faFilter} />
                        </Badge>
                    </IconButton>
                </Tooltip>
            </Grid>
            <Collapse in={Boolean(anchorEl)}>
                <Paper className={classes.filtersContent}>
                    <UsersFilter
                        sourcesOrganization={sourcesOrganization}
                        languages={languages}
                        counties={counties}
                        userTypes={userTypes}
                    />
                </Paper>
            </Collapse>
            <TableContainer component={Paper} className={classes.tableContainer}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {
                                Object.keys(UsersManagementTableHeaders).map(cellName => {
                                    const cellNameHeader = get(UsersManagementTableHeaders, cellName);
                                    return (
                                        <TableCell>
                                            <TableSortLabel
                                                active={cellNameHeader !== UsersManagementTableHeaders.watch &&
                                                    cellNameHeader !== UsersManagementTableHeaders.languages &&
                                                    cellNameHeader !== UsersManagementTableHeaders.investigationGroup &&
                                                    cellNameHeader !== UsersManagementTableHeaders.userType}
                                                direction={cellName === cellNameSort.name ? cellNameSort.direction : SortOrder.asc}
                                                onClick={() => handleSortOrder(cellName)}
                                                classes={{ root: cellName === cellNameSort.name ? classes.activeSortIcon : '', icon: classes.icon, active: classes.active }}
                                            >
                                                {cellNameHeader}
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
