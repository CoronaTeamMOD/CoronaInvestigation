import React from 'react'
import { Table } from '@material-ui/core';

import ContactNode from 'models/GroupedInvestigationContacts/ContactNode';

import TableRows from './TableRows/TableRows';
import TableHeader from './TableHeader/TableHeader';
import ErrorMessage from '../../../../../ErrorMessage/ErrorMessage';

const noResultsMessage = 'אין תוצאות מתאימות';

const ContactsTable = (props: Props) => {
    const { events, existingIds} = props;

    return (
        <>
        {
            events.length > 0 
            ? <Table>
                <TableHeader />
                <TableRows 
                    existingIds={existingIds}
                    events={events}
                />
             </Table>
            : <ErrorMessage 
                text={noResultsMessage}
              />
        }
        </>
    )
}

interface Props {
    events : ContactNode[];
    existingIds: string[];
}

export default ContactsTable
