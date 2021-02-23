import React from 'react'
import { TableCell, TableRow, Checkbox, Select, MenuItem, TextField } from '@material-ui/core';

import Contact from 'models/Contact';

const Row = (props: Props) => {
    const { contact } = props;
    return (
        <TableRow>
            <TableCell>
                <Checkbox
                    disabled={false}
                    color='primary'
                    checked={false}
                    id={`person-checkbox-${contact.personInfo}`}
                    onClick={() => {}}
                />    
            </TableCell> 
            <TableCell>{contact.firstName}</TableCell>
            <TableCell>{contact.lastName}</TableCell>
            <TableCell>{contact.identificationType}</TableCell>
            <TableCell>{contact.identificationNumber}</TableCell>
            <TableCell>
                <Select
                   id="demo-simple-select"
                   defaultValue={contact.contactType}
                   onChange={() => {}} 
                >
                    <MenuItem value={1}>הדוק</MenuItem>
                    <MenuItem value={2}>לא הדוק</MenuItem>
                </Select>
            </TableCell>
            <TableCell>{contact.phoneNumber}</TableCell>
            <TableCell>
                <TextField
                    id={`pesron-extraInfo-${contact.personInfo}`}
                    defaultValue={contact.extraInfo}
                    onChange={() => {}}
                />
            </TableCell>
        </TableRow>
    )
}

interface Props {
    contact : Contact
}

export default Row
