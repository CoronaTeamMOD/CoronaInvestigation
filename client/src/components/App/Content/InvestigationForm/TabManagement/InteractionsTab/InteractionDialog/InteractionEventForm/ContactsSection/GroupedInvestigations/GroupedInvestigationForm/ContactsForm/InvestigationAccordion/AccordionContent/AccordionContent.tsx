import React, { useState } from 'react';
import { AccordionDetails, Grid } from '@material-ui/core';

import ContactEvent from 'models/GroupedInvestigationContacts/ContactEvent';

import useAccordionContent from './useAccordionContent';
import ContactsTable from './ContactsTable/ContactsTable';
import TableSearchBar from './TableSearchBar/TableSearchBar';
import SelectedRowsMessage from './SelectedRowsMessage/SelectedRowsMessage';

const AccordionContent = (props: Props) => {
    const { events, isGroupReasonFamily, duplicateIds } = props;
    const [query, setQuery] = useState<string>('');
    const { getCurrentSelectedRowsLength, filteredEvents, existingIds } = useAccordionContent({events , query});   

    return (
        <AccordionDetails>
            <Grid container id="content-container">
                <Grid item xs={12}>
                    <TableSearchBar
                        id='table-search-bar'
                        onSearchClick={(query) => { 
                            setQuery(query);
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <ContactsTable
                        isGroupReasonFamily={isGroupReasonFamily}
                        events={filteredEvents}
                        existingIds={existingIds.concat(duplicateIds)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <SelectedRowsMessage
                        selectedRows={getCurrentSelectedRowsLength()}
                    />
                </Grid>
            </Grid>
        </AccordionDetails>
    )
}

interface Props {
    isGroupReasonFamily: boolean;
    events : ContactEvent[];
    duplicateIds: string[];
}

export default AccordionContent;
