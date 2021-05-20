import React from 'react';
import { CardContent, Typography, FormControl, Collapse, Card, Grid } from '@material-ui/core';

import adminActions from 'models/enums/adminActions';
import SelectDropdown from 'commons/Select/SelectDropdown';
import useStyles from './adminActionStyles';
import useAdminAction from './useAdminAction';
import AdminDataBaseAction from './adminDataBaseAction/adminDataBaseAction';
import AdminMessageAction from './adminMessageAction/adminMessageAction';

const AdminActions = (): JSX.Element => {
    const classes = useStyles();

    const { onAdminActionChange, selectedAdminAction} = useAdminAction();
    const adminActionTitle = 'פעולות אדמין';
    return (
        <Card className={classes.adminActionCard}>
            <CardContent >
                <Typography className={classes.cardTitle}>
                    <b>{adminActionTitle}</b>
                </Typography>
                <Grid xs={4}>
                    <FormControl variant='outlined' fullWidth>
                        <SelectDropdown
                            onChange={onAdminActionChange}
                            items={adminActions}
                            value={selectedAdminAction.id}
                        />
                    </FormControl>
                </Grid>
                <Collapse in={selectedAdminAction.id === adminActions[1].id} unmountOnExit>
                    <AdminDataBaseAction />
                </Collapse>
                <Collapse in={selectedAdminAction.id === adminActions[2].id} unmountOnExit>
                    <AdminMessageAction />
                </Collapse>
            </CardContent>
            
        </Card>
    )
}

export default AdminActions;
