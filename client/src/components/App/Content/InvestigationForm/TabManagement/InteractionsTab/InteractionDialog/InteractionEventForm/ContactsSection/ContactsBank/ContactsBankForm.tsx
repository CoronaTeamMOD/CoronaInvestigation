import React from 'react';
import { Typography, Grid, Paper } from '@material-ui/core';

import useStyles from './contactsBankFormStyles';
import ContactsBankTable from './ContactsBankTable/ContactsBankTable';

const headline = ':בנק מגעים';
const selectedCount = 2;

const ContactsBankForm = (props: Props) => {
    const classes = useStyles(); 

    return (
        <Grid container className={classes.wrapper}>
            <Grid xs={12}>    
                <Typography variant='h5'> 
                    {headline}
                </Typography>
            </Grid>
            <Grid xs={12}>
                <Paper>
                    {/* Search bar goes here */}
                    <ContactsBankTable />
                    <Typography align='right'>
                        {`נבחרו ${selectedCount} מגעים מבנק מגעים`}
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    )
}

interface Props {
    
}

export default ContactsBankForm
