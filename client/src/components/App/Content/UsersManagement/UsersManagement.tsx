import React from 'react'
import { Grid } from '@material-ui/core';

import useStyles from './UsersManagementStyles'
import UsersManagementTable from './UsersManagementTable/UsersManagementTable'

const UsersManagement: React.FC = () => {
    const classes = useStyles();

    return (
        <Grid className={classes.content}>
            <UsersManagementTable />
        </Grid>
    )
}

export default UsersManagement;