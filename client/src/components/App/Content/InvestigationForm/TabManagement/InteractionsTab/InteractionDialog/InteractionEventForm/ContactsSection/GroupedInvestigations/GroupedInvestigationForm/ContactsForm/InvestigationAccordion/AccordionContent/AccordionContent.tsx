import React from 'react';
import { AccordionDetails, Grid } from '@material-ui/core';

import ContactsTable from './ContactsTable/ContactsTable';
import ContactEvent from 'models/GroupedInvestigationContacts/ContactEvent';

interface Props {
    events : ContactEvent[]
}

const AccordionContent = (props: Props) => {
    return (
        <AccordionDetails>
            <Grid container>
                <Grid xs={12}>
                    <ContactsTable />
                </Grid>
                <Grid xs={12}>
                    <div>נבחרו X שורות</div>
                </Grid>
            </Grid>
        </AccordionDetails>
    )
}

export default AccordionContent
