import React from 'react';
import { AccordionDetails, Grid } from '@material-ui/core';

import ContactEvent from 'models/GroupedInvestigationContacts/ContactEvent';

import useAccordionContent from './useAccordionContent';
import ContactsTable from './ContactsTable/ContactsTable';
import SelectedRowsMessage from './SelectedRowsMessage/SelectedRowsMessage';

const AccordionContent = (props: Props) => {
    const { events, selectedRows, setSelectedRows} = props;

    const { getCurrentSelectedRowsLength } = useAccordionContent({events , selectedRows});   

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
                    <SelectedRowsMessage
                        selectedRows={getCurrentSelectedRowsLength()}
                    />
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
