import React, { useState } from 'react';
import { AccordionDetails, Grid } from '@material-ui/core';

import ContactEvent from 'models/GroupedInvestigationContacts/ContactEvent';

import useAccordionContent from './useAccordionContent';
import ContactsTable from './ContactsTable/ContactsTable';
import TableSearchBar from './TableSearchBar/TableSearchBar';
import SelectedRowsMessage from './SelectedRowsMessage/SelectedRowsMessage';

const AccordionContent = (props: Props) => {
    const { events } = props;
    const [query, setQuery] = useState<string>("");
    const { getCurrentSelectedRowsLength , existingIds , filteredEvents } = useAccordionContent({events , query});   

    return (
        <AccordionDetails>
            <Grid container>
                <Grid xs={12}>
                    <TableSearchBar
                        onSearchClick={(query) => { 
                            setQuery(query);
                        }}
                    />
                </Grid>
                <Grid xs={12}>
                    <ContactsTable
                        events={filteredEvents}
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
    events : ContactEvent[];
}

export default AccordionContent;
