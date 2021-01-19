import React from 'react'
import { Table } from '@material-ui/core';

import ContactEvent from 'models/GroupedInvestigationContacts/ContactEvent';

import TableRows from './TableRows/TableRows';
import TableHeader from './TableHeader/TableHeader';

const ContactsTable = (props: Props) => {
    const { events, selectedRows , setSelectedRows} = props;
    
    return (
        <Table>
            <TableHeader />
            <TableRows 
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                events={events}
            />
        </Table>
    )
}

interface Props {
    selectedRows : number[];
    setSelectedRows: React.Dispatch<React.SetStateAction<number[]>>;
    events : ContactEvent[];
}

export default ContactsTable
