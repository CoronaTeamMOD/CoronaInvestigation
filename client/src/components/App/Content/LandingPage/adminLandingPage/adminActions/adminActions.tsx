import React from 'react';
import { CardContent, Typography, FormControl, Collapse, Card, Grid } from '@material-ui/core';

import adminActions from 'models/enums/adminActions';
import SelectDropdown from 'commons/Select/SelectDropdown';

import useStyles from './adminActionStyles';
import useAdminAction from './useAdminAction';
import AdminDBAction from './adminDBAction/adminDBAction';
import AdminMessageAction from './adminMessageAction/adminMessageAction';

const adminActionTitle = 'פעולות אדמין';

const AdminActions = (): JSX.Element => {

    const classes = useStyles();

    const { onAdminActionChange, selectedAdminAction } = useAdminAction();

    return (
        <Card className={classes.adminActionCard}>
            <CardContent >
                <Typography className={classes.cardTitle}>
                    <b>{adminActionTitle}</b>
                </Typography>

                <Grid xs={4} className={classes.selectAction}>
                    <FormControl variant='outlined' fullWidth>
                        <SelectDropdown
                            onChange={onAdminActionChange}
                            items={adminActions}
                            value={selectedAdminAction.id}
                        />
                    </FormControl>
                </Grid>

                <Collapse in={selectedAdminAction.id === adminActions[1].id} unmountOnExit>
                    <AdminDBAction />
                </Collapse>

                <Collapse in={selectedAdminAction.id === adminActions[2].id} unmountOnExit>
                    <AdminMessageAction />
                </Collapse>

            </CardContent>
        </Card>
    )
};

export default AdminActions;