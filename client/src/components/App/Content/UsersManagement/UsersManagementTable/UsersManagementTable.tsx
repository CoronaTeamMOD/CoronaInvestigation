import React from 'react';
import { Grid, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TableSortLabel } from '@material-ui/core';

import { UsersManagementTableHeaders } from './UsersManagementTableHeaders'
import useStyles from './UsersManagementTableStyles'

const UsersManagementTable: React.FC = () => {
    const classes = useStyles();
    return (
        <Grid className={classes.content}>
            <TableContainer component={Paper} className={classes.tableContainer}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {
                                Object.values(UsersManagementTableHeaders).map(title => (
                                    <TableCell>
                                        <TableSortLabel
                                            active
                                        >
                                            {title}
                                        </TableSortLabel>
                                    </TableCell>
                                ))
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    );
};


export default UsersManagementTable;
