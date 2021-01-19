import React from 'react'
import { TableHead, TableRow, TableCell } from '@material-ui/core';

import TableCoulmns from '../tableColumns';

const TableHeader = (props: Props) => {
    return (
        <TableHead>
            <TableRow>
                <TableCell />
                <TableCell>{TableCoulmns.firstName}</TableCell>
                <TableCell>{TableCoulmns.lastName}</TableCell>
                <TableCell>{TableCoulmns.identificationType}</TableCell>
                <TableCell>{TableCoulmns.identificationNumber}</TableCell>
                <TableCell>{TableCoulmns.birthDate}</TableCell>
                <TableCell>{TableCoulmns.phoneNum}</TableCell>
                <TableCell>{TableCoulmns.secondaryPhoneNum}</TableCell>
                <TableCell>{TableCoulmns.isolationCity}</TableCell>
            </TableRow>
        </TableHead>
    )
}

interface Props {
    
}


export default TableHeader
