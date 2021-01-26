import React, { useState } from 'react';
import { AccordionDetails, Grid } from '@material-ui/core';

import ContactEvent from 'models/GroupedInvestigationContacts/ContactEvent';

import useAccordionContent from './useAccordionContent';
import ContactsTable from './ContactsTable/ContactsTable';
import TableSearchBar from './TableSearchBar/TableSearchBar';
import SelectedRowsMessage from './SelectedRowsMessage/SelectedRowsMessage';

const AccordionContent = (props: Props) => {
    const { events } = props;
    const [searchQuery, setsearchQueries] = useState<string>("")
    const { getCurrentSelectedRowsLength , existingIds } = useAccordionContent({events});   

    const test = () => {
        console.log(searchQuery);
    }

    return (
        <AccordionDetails>
            <Grid container>
                <Grid xs={12}>
                    <TableSearchBar
                        value={searchQuery}
                        onSearchClick={() => { 
                            test();
                        }}
                        onKeyDown={(e: React.KeyboardEvent) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                test()
                            }
                        }}
                        name={''}
                        onChange={(value) => { 
                            setsearchQueries(value);
                        }}
                    />
                </Grid>
                <Grid xs={12}>
                    <ContactsTable
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
    events : ContactEvent[];
}

export default AccordionContent;
