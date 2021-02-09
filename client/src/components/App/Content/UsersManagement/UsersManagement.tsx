import {
    Grid, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody,
    IconButton, Tooltip, TableSortLabel, Badge, Typography, Collapse, MenuItem, Select, Button
} from '@material-ui/core';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Pagination } from '@material-ui/lab';
import { Edit, PersonPin } from '@material-ui/icons';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Desk from 'models/Desk';
import County from 'models/County';
import UserType from 'models/enums/UserType';
import SortOrder from 'models/enums/SortOrder';
import StoreStateType from 'redux/storeStateType';
import SearchBar from 'commons/SearchBar/SearchBar';
import useDesksUtils from 'Utils/Desk/useDesksUtils';
import { get } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';
import { userValidationSchema } from 'Utils/UsersUtils/userUtils'; 
import IsActiveToggle from 'commons/IsActiveToggle/IsActiveToggle';

import useStyles from './UsersManagementStyles';
import UsersFilter from './UsersFilter/UsersFilter';
import useUsersManagement from './useUsersManagement';
import filterCreators from './UsersFilter/FilterCreators';
import UserInfoDialog from './UserInfoDialog/UserInfoDialog';
import EditUserInfoDialog from './EditUserInfoDialog/EditUserInfoDialog';
import { UsersManagementTableHeaders, UsersManagementTableHeadersNames } from './UsersManagementTableHeaders';

const rowsPerPage: number = 100;
export const defaultPage: number = 1;

interface CellNameSort {
    name: string;
    direction: SortOrder | undefined;
};

export const usersManagementTitle = 'ניהול משתמשים';
const sourceOrganizationLabel = 'מסגרת';
const searchBarLabel = 'הכנס שם או שם משתמש...';
const deactivateAllCountyUsersText = 'כיבוי כל החוקרים בנפה';

export const notActiveSortFields: string[] = [UsersManagementTableHeadersNames.WATCH, UsersManagementTableHeadersNames.LANGUAGES,
                                       UsersManagementTableHeadersNames.COUNTY, UsersManagementTableHeadersNames.USER_TYPE,
                                       UsersManagementTableHeadersNames.DESK, UsersManagementTableHeadersNames.EDIT];

const UsersManagement: React.FC = () => {
    const [page, setPage] = useState<number>(defaultPage);
    const [cellNameSort, setCellNameSort] = useState<CellNameSort>({ name: '', direction: undefined });
    const [isFilterOpen, setIsFilterOpen] = React.useState<boolean>(false);
    const allCounties = useSelector<StoreStateType, County[]>(state => state.county.allCounties);
    const userType = useSelector<StoreStateType, number>(state => state.user.data.userType);
    
    const { users, sourcesOrganization, userTypes, languages,
            totalCount, userDialog, editUserDialog, isBadgeInVisible, 
            watchUserInfo, handleCloseUserDialog, editUserInfo, 
            handleCloseEditUserDialog, handleFilterChange, 
            setUserActivityStatus, setUserSourceOrganization, 
            setUserDesk, setUserCounty, handleDeactivateAllUsersCounty } =
            useUsersManagement({ page, rowsPerPage, cellNameSort, setPage });

    const totalPages: number = Math.ceil(totalCount / rowsPerPage);

    const classes = useStyles();

    const { countyDesks } = useDesksUtils();

    const handleSortOrder = (cellName: string) => {
        if (!notActiveSortFields.includes(cellName)) {
            setCellNameSort({
                name: cellName,
                direction: cellNameSort.name !== cellName ? SortOrder.asc :
                    cellNameSort.direction === SortOrder.asc ? SortOrder.desc : SortOrder.asc
            });
        }
    };

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
            case UsersManagementTableHeadersNames.EDIT: {
                return (
                    <Tooltip title='עריכת פרטי המשתמש'>
                        <IconButton onClick={() => editUserInfo(row)}>
                            <Edit />
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
                            countyDesks.map((desk: Desk) => (
                                <MenuItem
                                    key={desk.id}
                                    value={desk.id!}>
                                    {desk.deskName}
                                </MenuItem>
                            ))
                        }
                    </Select>
                )
                
            }
            case UsersManagementTableHeadersNames.SOURCE_ORGANIZATION : {
                return (
                    <Tooltip placement="top" disableHoverListener={row['authority'] === null} 
                             title={row['authority']?.authorityName}>
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
                    </Tooltip>
                )
            }
            case UsersManagementTableHeadersNames.COUNTY : {
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
                        onChange={(event: React.ChangeEvent<any>) => setUserCounty(event.target.value as number, row[UsersManagementTableHeadersNames.MABAR_USER_NAME])}
                        className={classes.desks}
                        variant='outlined'
                    >
                        {
                            allCounties.map((county: County) => (
                                <MenuItem
                                    key={county.id}
                                    value={county.id}>
                                    {county.displayName}
                                </MenuItem>
                            ))
                        }
                    </Select>
                )
            }
            default:
                return row[cellName]
        }
    };

    return (
        <Grid className={classes.content}>
            <Grid>
                <Typography color='textPrimary' id='user-management-title' className={classes.header}>
                    {usersManagementTitle}
                </Typography>
            </Grid>
            <Grid container justify='space-between' id='user-management-filters' className={classes.filters}>
                <SearchBar 
                    searchBarLabel={searchBarLabel}
                    onClick={(value: string) => handleFilterChange(filterCreators.SEARCH_BAR(value))}
                    validationSchema={userValidationSchema}
                />

                <Grid item>
                    {
                        (userType === UserType.ADMIN) &&
                        <Button
                            id='deactivate-all-users-button'
                            variant='contained'
                            color='inherit'
                            className={classes.deactivateButton}
                            onClick={handleDeactivateAllUsersCounty}
                        >
                            {deactivateAllCountyUsersText}
                        </Button>  
                    } 
                    <Tooltip title='סינון'>
                        <IconButton onClick={() => setIsFilterOpen(!isFilterOpen)} id='filterButton'>
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
            </Grid>
            <Collapse in={isFilterOpen} style={{ minHeight: 'unset' }}>
                <Paper id='filters-collapse' className={classes.filtersContent}>
                    <UsersFilter
                        sourcesOrganization={sourcesOrganization}
                        languages={languages}
                        counties={allCounties}
                        userTypes={userTypes}
                        handleFilterChange={handleFilterChange}
                        handleCloseFitler={() => setIsFilterOpen(false)}
                    />
                </Paper>
            </Collapse>
            <TableContainer component={Paper} className={classes.tableContainer}>
                <Table stickyHeader id='users-table'>
                    <TableHead id='users-table-header'>
                        <TableRow>
                            {
                                Object.keys(UsersManagementTableHeaders).map((cellName , index) => {
                                    return (
                                        <TableCell key={cellName+index} id={`table-header-${cellName}`}>
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
                handleCloseUserDialog={handleCloseUserDialog}
            />
            <EditUserInfoDialog
                open={editUserDialog.isOpen}
                defaultValues={editUserDialog.info}
                handleCloseEditUserDialog={handleCloseEditUserDialog}
            />
        </Grid>
    );
};

export default UsersManagement;