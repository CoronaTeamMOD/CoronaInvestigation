import React from 'react'
import { TableBody , TableRow , TableCell, Checkbox } from '@material-ui/core';

import formatDate from 'Utils/DateUtils/formatDate';
import ContactEvent from 'models/GroupedInvestigationContacts/ContactEvent';

const TableRows = (props: Props) => {
    const { events } = props;
    return (
        <TableBody>
            {
                events.map((event) => {
                    const { nodes } = event.contactedPeopleByContactEvent;

                    if(nodes !== []) {
                        return nodes.map((person) => {
                            const {
                                firstName,
                                lastName,
                                identificationType,
                                identificationNumber,
                                birthDate,
                                phoneNumber,
                                additionalPhoneNumber,
                                id
                            } = person.personByPersonInfo;
                            const isolationCity = person.addressByIsolationAddress?.cityByCity?.displayName;

                            return (
                                <TableRow key={id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={true}
                                            onClick={() => console.log(person)}
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
                    }
                })
            }
        </TableBody>
    )
}

interface Props {
    events : ContactEvent[]
}

export default TableRows
