import React, { useState } from 'react';
import { Grid, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody,
         IconButton, Tooltip } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { PersonPin } from '@material-ui/icons';

import IsActiveToggle from 'commons/IsActiveToggle/IsActiveToggle'

import { UsersManagementTableHeaders, UsersManagementTableHeadersNames } from './UsersManagementTableHeaders'
import useStyles from './UsersManagementStyles'
import useUsersManagementTable from './useUsersManagement';

const rowsPerPage: number = 7;

const UsersManagement: React.FC = () => {
    const [page, setPage] = useState<number>(1);

    const { users, totalCount } = useUsersManagementTable({ page, rowsPerPage });
    
    const totalPages: number = Math.ceil(totalCount / rowsPerPage);

    const classes = useStyles();
    
    const getTableCell = (row: any, cellName: string) => {
        switch (cellName) {
            case UsersManagementTableHeadersNames.LANGUAGES: {
                return row[cellName].join(', ')
            }
            case UsersManagementTableHeadersNames.USER_STATUS: {
                return (
                    <IsActiveToggle 
                        value={row[cellName]} 
                        setUserActivityStatus={(isActive: boolean) => console.log(isActive) }
                    />
                )
            }
            case UsersManagementTableHeadersNames.WATCH: {
                return (
                    <Tooltip title='צפייה בפרטי המשתמש'>
                        <IconButton>
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
            <TableContainer component={Paper} className={classes.tableContainer}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {
                                Object.values(UsersManagementTableHeaders).map(cellName => (
                                    <TableCell>
                                        {cellName}
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
        </Grid>
    );
};


export default UsersManagement;
