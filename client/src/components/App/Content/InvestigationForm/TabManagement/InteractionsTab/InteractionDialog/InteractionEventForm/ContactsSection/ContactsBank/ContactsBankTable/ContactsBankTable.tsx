import React from 'react'
import { Table } from '@material-ui/core';

import Contact from 'models/Contact';

import Row from './Row/Row';
import TableHeader from './TableHeader/TableHeader';
import UseContactsBankTable from './useContactsBankTable';

const ContactsBankTable = (props: Props) => {
    const { filteredPersons } = UseContactsBankTable(props);

    return (
        <Table>
            <TableHeader />
            {filteredPersons.map( contact => {
                return (
                    <Row 
                        contact={contact}
                    />
                )
            })}
        </Table>
    )
}

interface Props {
    existingPersons: Map<number,Contact>;
    query:string;
}

export default ContactsBankTable
