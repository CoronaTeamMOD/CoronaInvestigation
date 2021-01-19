import React from 'react';
import { AccordionDetails, Grid } from '@material-ui/core';

import ContactEvent from 'models/GroupedInvestigationContacts/ContactEvent';

import ContactsTable from './ContactsTable/ContactsTable';

const AccordionContent = (props: Props) => {
    const { events, selectedRows, setSelectedRows} = props;

    return (
        <AccordionDetails>
            <Grid container>
                <Grid xs={12}>
                    <ContactsTable
                        selectedRows={selectedRows}
                        setSelectedRows={setSelectedRows}
                        events={events}
                    />
                </Grid>
                <Grid xs={12}>
                    <div>נבחרו X שורות</div>
                </Grid>
            </Grid>
        </AccordionDetails>
    )
}

interface Props {
    selectedRows : number[];
    setSelectedRows: React.Dispatch<React.SetStateAction<number[]>>;
    events : ContactEvent[];
}

export default AccordionContent
