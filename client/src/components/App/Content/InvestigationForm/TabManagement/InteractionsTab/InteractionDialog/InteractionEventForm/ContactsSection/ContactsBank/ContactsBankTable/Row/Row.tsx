import React from 'react'
import { TableCell, TableRow } from '@material-ui/core';

import Contact from 'models/Contact';

const Row = (props: Props) => {
    const { contact } = props;
    return (
        <TableRow>
            <TableCell />
            <TableCell>{contact.firstName}</TableCell>
            <TableCell>{contact.lastName}</TableCell>
            <TableCell>{contact.identificationType}</TableCell>
            <TableCell>{contact.identificationNumber}</TableCell>
            <TableCell>{contact.contactType === 1 ? 'הדוק' : 'לא הדוק'}</TableCell>
            <TableCell>{contact.phoneNumber}</TableCell>
            <TableCell>{contact.extraInfo}</TableCell>
        </TableRow>
    )
}

interface Props {
    contact : Contact
}

export default Row
