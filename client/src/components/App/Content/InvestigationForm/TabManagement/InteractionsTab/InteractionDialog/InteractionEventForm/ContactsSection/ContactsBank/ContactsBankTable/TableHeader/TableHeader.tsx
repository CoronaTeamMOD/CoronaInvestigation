import React from 'react'
import { TableCell, TableHead, TableRow } from '@material-ui/core'

import TableCoulmns from '../TableColumns';

const TableHeader = () => {
    return (
        <TableHead>
            <TableRow>
                <TableCell />
                <TableCell>{TableCoulmns.firstName}</TableCell>
                <TableCell>{TableCoulmns.lastName}</TableCell>
                <TableCell>{TableCoulmns.identificationType}</TableCell>
                <TableCell>{TableCoulmns.identificationNumber}</TableCell>
                <TableCell>{TableCoulmns.contactType}</TableCell>
                <TableCell>{TableCoulmns.phoneNum}</TableCell>
                <TableCell>{TableCoulmns.extraDesc}</TableCell>
            </TableRow>
        </TableHead>
    )
}

export default TableHeader;
