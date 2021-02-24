import React, {useContext} from 'react';
import { Typography, Grid, Paper } from '@material-ui/core';

import Contact from 'models/Contact';
import {contactBankContext} from 'commons/Contexts/ContactBankContext';

import useStyles from './contactsBankFormStyles';
import ContactsBankTable from './ContactsBankTable/ContactsBankTable';

const headline = 'בנק מגעים:';

const ContactsBankForm = (props: Props) => {
    const { existingPersons } = props;
    const classes = useStyles(); 
    const {contactBank} = useContext(contactBankContext);
    
    const selectedContactsCount = Array.from(contactBank)
        .filter(contact => contact[1].checked).length

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
                    <ContactsBankTable 
                        existingPersons={existingPersons}
                    />
                    <Typography align='right'>
                        {`נבחרו ${selectedContactsCount} מגעים מבנק מגעים`}
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    )
}

interface Props {
    existingPersons: Map<number,Contact>;
}

export default ContactsBankForm
