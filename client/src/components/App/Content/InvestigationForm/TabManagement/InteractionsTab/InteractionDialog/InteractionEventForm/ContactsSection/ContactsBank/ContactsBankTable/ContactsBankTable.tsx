import React from 'react'
import { Table } from '@material-ui/core';

import Contact from 'models/Contact';

import Row from './Row/Row';
import TableHeader from './TableHeader/TableHeader';

const ContactsBankTable = (props: Props) => {
    const { existingPersons } = props;
    const personsArray = Array.from(existingPersons).map(person => person[1]);

    return (
        <Table>
            <TableHeader />
            {personsArray.map( contact => {
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
}

export default ContactsBankTable
