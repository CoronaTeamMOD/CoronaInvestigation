import React from 'react';
import { Grid, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody,
         TableSortLabel, TextField, Icon } from '@material-ui/core';
import { Autocomplete, ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { PersonPin } from '@material-ui/icons';

import SourceOrganization from 'models/SourceOrganization';
import County from 'models/County';

import { UsersManagementTableHeaders, UsersManagementTableHeadersNames } from './UsersManagementTableHeaders'
import useStyles from './UsersManagementTableStyles'
import useUsersManagementTable from './useUsersManagementTable';

const UsersManagementTable: React.FC = () => {
    const { users, sourcesOrganization, counties } = useUsersManagementTable();
    const classes = useStyles();

    const GenericAutoComplete = (options: County[] | SourceOrganization[], value: any) => (
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

    const getTableCell = (row: any, cellName: string) => {
        switch(cellName) {
            case UsersManagementTableHeadersNames.SOURCE_ORGANIZATION: {
                return GenericAutoComplete(sourcesOrganization, row[cellName])
            }
            case UsersManagementTableHeadersNames.COUNTY: {
                return GenericAutoComplete(counties, row[cellName])
            }
            case UsersManagementTableHeadersNames.LANGUAGES: {
                return row[cellName].join(', ')
            }
            case UsersManagementTableHeadersNames.USER_STATUS: {
                // TODO: use generic isActiveToggle
                return (
                    <ToggleButtonGroup 
                        value={row[cellName]}
                    >
                        <ToggleButton
                            value={true}
                            className={classes.toggle}
                            style={row[cellName] ? { backgroundColor: '#57ff83' } : undefined }
                        >
                            פעיל
                        </ToggleButton>
                        <ToggleButton 
                            value={false} 
                            className={classes.toggle}
                            style={!row[cellName] ? { backgroundColor: '#fc4e5f' } : undefined }
                        >
                            לא פעיל
                        </ToggleButton>
                    </ToggleButtonGroup>
                )
            }
            case UsersManagementTableHeadersNames.WATCH: {
                return <PersonPin />
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
        </Grid>
    );
};


export default UsersManagementTable;
