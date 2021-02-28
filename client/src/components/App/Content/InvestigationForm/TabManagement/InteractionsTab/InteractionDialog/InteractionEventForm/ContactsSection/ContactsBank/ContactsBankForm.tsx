import React, { useContext, useState } from 'react';
import { Typography, Grid, Paper } from '@material-ui/core';

import Contact from 'models/Contact';
import {contactBankContext} from 'commons/Contexts/ContactBankContext';

import useStyles from './contactsBankFormStyles';
import ContactsBankTable from './ContactsBankTable/ContactsBankTable';
import ContactsBankSearchBar from './ContactsBankSearchBar/ContactsBankSearchBar';

const headline = 'בנק מגעים:';

const ContactsBankForm = (props: Props) => {
    const { existingPersons } = props;
    const classes = useStyles(); 
    const {contactBank} = useContext(contactBankContext);
    const [query, setQuery] = useState<string>('');
    const selectedContactsCount = Array.from(contactBank)
        .filter(contact => contact[1].checked).length

    return (
        <Grid container className={classes.wrapper}>
            <Grid item xs={12}>    
                <Typography variant='h5' id='healinebruh'> 
                    {headline}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Paper>
                    <ContactsBankSearchBar
                        id='contacts-bank-search-bar'
                        onSearchClick={(query) => { 
                            setQuery(query);
                        }}
                    />
                    <ContactsBankTable 
                        query={query}
                        existingPersons={existingPersons}
                    />
                    <Typography align='right' id='contacts-bank-selected-cound'>
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
