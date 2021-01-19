import React from 'react'
import { Table } from '@material-ui/core';

import TableHeader from './TableHeader/TableHeader';

interface Props {
    
}

const ContactsTable = (props: Props) => {
    return (
        <Table>
            <TableHeader />
        </Table>
    )
}

export default ContactsTable
