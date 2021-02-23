import React from 'react'
import { TableCell, TableRow } from '@material-ui/core';

const Row = (props: Props) => {
    const { contact } = props;
    return (
        <TableRow>
            <TableCell />
            <TableCell>{contact.firstName}</TableCell>
            <TableCell>{contact.lastName}</TableCell>
            <TableCell>{contact.identifiactionType}</TableCell>
            <TableCell>{contact.identifiactionNumber}</TableCell>
            <TableCell>{contact.contactType === 1 ? 'הדוק' : 'לא הדוק'}</TableCell>
            <TableCell>{contact.phoneNum}</TableCell>
            <TableCell>{contact.extraDesc}</TableCell>
        </TableRow>
    )
}

interface Props {
    contact : any
}

export default Row
