import React from 'react'
import { TableCell, TableRow, Checkbox, Select, MenuItem, TextField } from '@material-ui/core';

import Contact from 'models/Contact';

import UseRow from './useRow';
import useStyles from './rowStyles';

const Row = (props: Props) => {
    const { contact } = props;
    const classes = useStyles();

    const { 
        isPersonChecked,
        handleCheckboxClick, 
        handleContactTypeChange, 
        handleExtraInfoChange,
        doesPersonExistInEvent 
    } = UseRow({contact});


    const isChecked = isPersonChecked();
    const doesExist = doesPersonExistInEvent();

    const rowClass = doesExist
        ? classes.disabled
        : isChecked
            ? classes.selected
            : '';
    const { personInfo } = contact;
    return (
        <TableRow className={rowClass}>
            <TableCell>
                <Checkbox
                    disabled={doesExist}
                    color='primary'
                    checked={isChecked}
                    id={`person-checkbox-${personInfo}`}
                    onClick={handleCheckboxClick}
                />    
            </TableCell> 
            <TableCell>{contact.firstName}</TableCell>
            <TableCell>{contact.lastName}</TableCell>
            <TableCell>{contact.identificationType}</TableCell>
            <TableCell>{contact.identificationNumber}</TableCell>
            <TableCell>
                <Select
                   id="demo-simple-select"
                   disabled={doesExist}
                   defaultValue={contact.contactType}
                   onChange={(e) => {handleContactTypeChange(e.target.value)}} 
                >
                    <MenuItem value={1}>הדוק</MenuItem>
                    <MenuItem value={2}>לא הדוק</MenuItem>
                </Select>
            </TableCell>
            <TableCell>{contact.phoneNumber}</TableCell>
            <TableCell>
                <TextField
                    id={`pesron-extraInfo-${personInfo}`}
                    disabled={doesExist}
                    defaultValue={contact.extraInfo}
                    onChange={(e) => {handleExtraInfoChange(e.target.value)}}
                />
            </TableCell>
        </TableRow>
    )
}

interface Props {
    contact : Contact
}

export default Row
