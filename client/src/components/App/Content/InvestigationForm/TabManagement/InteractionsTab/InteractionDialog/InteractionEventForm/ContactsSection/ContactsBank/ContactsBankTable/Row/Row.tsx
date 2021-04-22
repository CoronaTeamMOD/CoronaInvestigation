import React from 'react'
import { TableCell, TableRow, Checkbox, Select, MenuItem, TextField } from '@material-ui/core';

import Contact from 'models/Contact';

import UseRow from './useRow';

const Row = (props: Props) => {
    const { contact } = props;
    

    const { 
        isPersonChecked,
        handleCheckboxClick, 
        handleContactTypeChange, 
        handleExtraInfoChange,
        doesPersonExistInEvent,
        getRowClass
    } = UseRow({contact});

    const doesExist = doesPersonExistInEvent();
    const rowClass = getRowClass();

    const { personInfo } = contact;
    return (
        <TableRow className={rowClass} id={`person-row-${personInfo}`}>
            <TableCell>
                <Checkbox
                    disabled={doesExist}
                    color='primary'
                    checked={isPersonChecked()}
                    id={`person-checkbox-${personInfo}`}
                    onClick={handleCheckboxClick}
                />    
            </TableCell> 
            <TableCell>{contact.firstName}</TableCell>
            <TableCell>{contact.lastName}</TableCell>
            <TableCell>{contact.identificationType.type}</TableCell>
            <TableCell>{contact.identificationNumber}</TableCell>
            <TableCell>
                <Select
                   id={`person-contactType-${personInfo}`}
                   disabled={doesExist}
                   defaultValue={doesExist ? contact.contactType : 1}
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
                    defaultValue={doesExist ? contact.extraInfo : ''}
                    onChange={(e) => {handleExtraInfoChange(e.target.value)}}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                        }
                    }}                
                />
            </TableCell>
        </TableRow>
    )
}

interface Props {
    contact : Contact
}

export default Row
