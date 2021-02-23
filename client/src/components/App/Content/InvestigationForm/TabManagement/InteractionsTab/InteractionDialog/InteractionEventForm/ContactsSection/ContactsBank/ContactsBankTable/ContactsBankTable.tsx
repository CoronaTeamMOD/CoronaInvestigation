import React from 'react'
import { Table } from '@material-ui/core';

import Row from './Row/Row';
import TableHeader from './TableHeader/TableHeader';

const contacts = [
    {
        firstName : 'יוסי',
        lastName: 'יוסי',
        identifiactionType: `ת"ז`,
        identifiactionNumber: '207950171',
        contactType: 1,
        phoneNum: '0545802270',
        extraDesc: 'abcdefg'
    }
]

const ContactsBankTable = (props: Props) => {
    return (
        <Table>
            <TableHeader />
            {contacts.map( contact => {
                return(
                    <Row 
                        contact={contact}
                    />
                )
            })}
        </Table>
    )
}

interface Props {
    
}

export default ContactsBankTable
