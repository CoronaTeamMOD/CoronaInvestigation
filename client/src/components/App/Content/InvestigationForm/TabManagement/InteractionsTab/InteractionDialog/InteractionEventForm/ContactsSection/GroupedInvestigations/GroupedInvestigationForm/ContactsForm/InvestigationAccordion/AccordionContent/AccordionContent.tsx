import React from 'react';
import { useFormContext } from 'react-hook-form';
import { AccordionDetails, Grid } from '@material-ui/core';

import Contact from 'models/Contact';
import { IdToCheck } from 'Utils/Contacts/useDuplicateContactId';
import ContactEvent from 'models/GroupedInvestigationContacts/ContactEvent';

import useAccordionContent from './useAccordionContent';
import ContactsTable from './ContactsTable/ContactsTable';
import SelectedRowsMessage from './SelectedRowsMessage/SelectedRowsMessage';

const AccordionContent = (props: Props) => {
    const { events, selectedRows, setSelectedRows, allContactIds} = props;
    const { getValues } = useFormContext();

    const existingIds = allContactIds.map(contact => {
        if(contact.id) { 
            return contact.id;
        }
        return "";
    })!;
    const { getCurrentSelectedRowsLength } = useAccordionContent({events , selectedRows});   

    return (
        <AccordionDetails>
            <Grid container>
                <Grid xs={12}>
                    <ContactsTable
                        selectedRows={selectedRows}
                        setSelectedRows={setSelectedRows}
                        events={events}
                        existingIds={existingIds}
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
    allContactIds: IdToCheck[];
}

export default AccordionContent;
