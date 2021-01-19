import React from 'react'
import { Table } from '@material-ui/core';

import ContactEvent from 'models/GroupedInvestigationContacts/ContactEvent';

import TableRows from './TableRows/TableRows';
import TableHeader from './TableHeader/TableHeader';

const ContactsTable = (props: Props) => {
    const { events } = props;
    
    return (
        <Table>
            <TableHeader />
            <TableRows 
                events={events}
            />
        </Table>
    )
}

interface Props {
    events : ContactEvent[]
}

export default ContactsTable
