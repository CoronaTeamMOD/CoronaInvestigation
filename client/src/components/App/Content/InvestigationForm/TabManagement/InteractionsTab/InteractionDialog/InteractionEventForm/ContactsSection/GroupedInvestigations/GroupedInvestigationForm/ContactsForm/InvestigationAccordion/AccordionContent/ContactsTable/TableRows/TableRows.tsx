import React from 'react'
import { TableBody , TableRow , TableCell, Checkbox } from '@material-ui/core';

import formatDate from 'Utils/DateUtils/formatDate';
import ContactEvent from 'models/GroupedInvestigationContacts/ContactEvent';

import useStyles from './tableRowsStyles';
import useTableRows from './useTableRows';

const TableRows = (props: Props) => {
    const { events , selectedRows , setSelectedRows} = props;
    const classes = useStyles();
    const { handleCheckboxToggle } = useTableRows({selectedRows , setSelectedRows});
    return (
        <TableBody>
            {
                events.map((event) => {
                    const { nodes } = event.contactedPeopleByContactEvent;

                    return nodes.map((person) => {
                        const {id} = person;
                        const {
                            firstName,
                            lastName,
                            identificationType,
                            identificationNumber,
                            birthDate,
                            phoneNumber,
                            additionalPhoneNumber
                        } = person.personByPersonInfo;
                        const isolationCity = person.addressByIsolationAddress?.cityByCity?.displayName;

                        const isRowSelected = selectedRows.indexOf(id) !== -1;
                        return (
                            <TableRow key={id} className={isRowSelected ? classes.selected : ''}>
                                <TableCell>
                                    <Checkbox
                                        color='primary'
                                        checked={isRowSelected}
                                        onClick={() => handleCheckboxToggle(id)}
                                    />
                                </TableCell>
                                <TableCell>{firstName}</TableCell>
                                <TableCell>{lastName}</TableCell>
                                <TableCell>{identificationType}</TableCell>
                                <TableCell>{identificationNumber}</TableCell>
                                <TableCell>{formatDate(new Date(birthDate))}</TableCell>
                                <TableCell>{phoneNumber}</TableCell>
                                <TableCell>{additionalPhoneNumber}</TableCell>
                                <TableCell>{isolationCity}</TableCell>
                            </TableRow>
                        )
                    })
                })
            }
        </TableBody>
    )
}

interface Props {
    selectedRows : number[]
    setSelectedRows: React.Dispatch<React.SetStateAction<number[]>>;
    events : ContactEvent[]
}

export default TableRows
