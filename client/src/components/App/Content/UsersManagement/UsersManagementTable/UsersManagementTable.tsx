import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody,
         TableSortLabel, TextField, IconButton, Tooltip } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { PersonPin } from '@material-ui/icons';

import SourceOrganization from 'models/SourceOrganization';
import County from 'models/County';
import UserTypeModel from 'models/UserType';
import UserTypeEnum from 'models/enums/UserType';
import IsActiveToggle from 'commons/IsActiveToggle/IsActiveToggle'
import StoreStateType from 'redux/storeStateType';

import { UsersManagementTableHeaders, UsersManagementTableHeadersNames } from './UsersManagementTableHeaders'
import useStyles from './UsersManagementTableStyles'
import useUsersManagementTable from './useUsersManagementTable';

const ACTIVE = 'פעיל';
const NOT_ACTIVE = 'לא פעיל';

const UsersManagementTable: React.FC = () => {
    const { users, sourcesOrganization, counties, userTypes } = useUsersManagementTable();
    const userType =  useSelector<StoreStateType, number>(state => state.user.userType);
    const classes = useStyles();

    const GenericAutoComplete = (options: County[] | SourceOrganization[] | UserTypeModel[], value: any) => (
        <Autocomplete
            options={options}
            getOptionLabel={(option) => option ? option.displayName : option}
            value={{ displayName: value }}
            renderInput={(params) =>
                <TextField
                    {...params}
                    className={classes.autoComplete}
                />
            }
        />
    )

    const GenericPersonIcon = () => (
        <Tooltip title='צפייה בפרטי המשתמש'>
            <IconButton>
                <PersonPin />
            </IconButton>
        </Tooltip>
    )
    
    const getAdminTableCell = (row: any, cellName: string) => {
        switch (cellName) {
            case UsersManagementTableHeadersNames.LANGUAGES: {
                return row[cellName].join(', ')
            }
            case UsersManagementTableHeadersNames.USER_STATUS: {
                return row[cellName] === true ? ACTIVE : NOT_ACTIVE
            }
            case UsersManagementTableHeadersNames.WATCH: {
                return GenericPersonIcon()
            }
            default: 
                return row[cellName]
        }
    }

    const getSuperAdminTableCell = (row: any, cellName: string) => {
        switch(cellName) {
            case UsersManagementTableHeadersNames.SOURCE_ORGANIZATION: {
                return GenericAutoComplete(sourcesOrganization, row[cellName])
            }
            case UsersManagementTableHeadersNames.LANGUAGES: {
                return row[cellName].join(', ')
            }
            case UsersManagementTableHeadersNames.COUNTY: {
                return GenericAutoComplete(counties, row[cellName])
            }
            case UsersManagementTableHeadersNames.USER_STATUS: {
                return (
                    <IsActiveToggle 
                        value={row[cellName]} 
                        setUserActivityStatus={(isActive: boolean) => console.log(isActive) }
                    />
                )
            }
            case UsersManagementTableHeadersNames.USER_TYPE: {
                return GenericAutoComplete(userTypes, row[cellName])
            }
            case UsersManagementTableHeadersNames.WATCH: {
                return GenericPersonIcon()
            }
            default: 
                return row[cellName]
        }
    }

    return (
        <Grid className={classes.content}>
            <TableContainer component={Paper} className={classes.tableContainer}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {
                                Object.values(UsersManagementTableHeaders).map(cellName => (
                                    <TableCell>
                                        <TableSortLabel
                                            active={cellName !== UsersManagementTableHeaders.watch}
                                        >
                                            {cellName}
                                        </TableSortLabel>
                                    </TableCell>
                                ))
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
                                                    userType === UserTypeEnum.ADMIN ?
                                                        getAdminTableCell(user, cellName):
                                                    userType === UserTypeEnum.SUPER_ADMIN ? 
                                                        getSuperAdminTableCell(user, cellName) : null

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
        </Grid>
    );
};


export default UsersManagementTable;
