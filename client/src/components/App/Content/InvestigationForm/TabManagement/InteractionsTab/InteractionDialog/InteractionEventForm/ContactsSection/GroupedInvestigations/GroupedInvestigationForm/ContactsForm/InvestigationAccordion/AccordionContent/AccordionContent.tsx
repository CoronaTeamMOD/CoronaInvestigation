import React from 'react';
import { AccordionDetails, Grid } from '@material-ui/core';

import ContactEvent from 'models/GroupedInvestigationContacts/ContactEvent';

import useAccordionContent from './useAccordionContent';
import ContactsTable from './ContactsTable/ContactsTable';
import TableSearchBar from './TableSearchBar/TableSearchBar';
import SelectedRowsMessage from './SelectedRowsMessage/SelectedRowsMessage';

const AccordionContent = (props: Props) => {
    const { events } = props;

    const { getCurrentSelectedRowsLength , existingIds } = useAccordionContent({events});   

    return (
        <AccordionDetails>
            <Grid container>
                <Grid xs={12}>
                    <TableSearchBar
                        value={''}
                        onSearchClick={
                            () => { console.log('hi!') }
                        }
                        onKeyDown={
                            () => { console.log('keydown') }
                        }
                        name={''}
                        onChange={() => { console.log('hi!') }}
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
