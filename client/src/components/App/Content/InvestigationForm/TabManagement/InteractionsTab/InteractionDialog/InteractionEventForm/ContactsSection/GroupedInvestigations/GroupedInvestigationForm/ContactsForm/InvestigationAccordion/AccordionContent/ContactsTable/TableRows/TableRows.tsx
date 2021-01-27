import React , { useContext } from 'react'
import { TableBody , TableRow , TableCell, Checkbox } from '@material-ui/core';

import formatDate from 'Utils/DateUtils/formatDate';
import useInvolvedContact from 'Utils/vendor/useInvolvedContact';
import ContactNode from 'models/GroupedInvestigationContacts/ContactNode';
import { groupedInvestigationsContext } from 'commons/Contexts/GroupedInvestigationFormContext';

import useStyles from './tableRowsStyles';
import useTableRows from './useTableRows';

const TableRows = (props: Props) => {
    const { events , existingIds } = props;
    const groupedInvestigationsContextState = useContext(groupedInvestigationsContext);
    const classes = useStyles();
    const { isInvolvedThroughFamily } = useInvolvedContact();
    const { handleCheckboxToggle } = useTableRows();

    return (
        <TableBody>
            {
                events.map((person) => {
                        const {involvedContactByInvolvedContactId} = person;
                        const isFamily = involvedContactByInvolvedContactId && isInvolvedThroughFamily(involvedContactByInvolvedContactId.involvementReason);
                        
                        if(!isFamily) {
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

                            const isRowSelected = groupedInvestigationsContextState.groupedInvestigationContacts.indexOf(id) !== -1;
                            const isRowDisabled = existingIds.indexOf(identificationNumber) !== -1;
                            const rowClass = isRowDisabled 
                                                ? classes.disabled
                                                : isRowSelected 
                                                    ? classes.selected
                                                    : ''

                            return (
                                <TableRow key={id} className={rowClass}>
                                    <TableCell>
                                        <Checkbox
                                            disabled={isRowDisabled}
                                            color='primary'
                                            checked={isRowSelected}
                                            onClick={() => handleCheckboxToggle(id)}
                                        />
                                    </TableCell>
                                    <TableCell>{firstName}</TableCell>
                                    <TableCell>{lastName}</TableCell>
                                    <TableCell>{identificationType}</TableCell>
                                    <TableCell>{identificationNumber}</TableCell>
                                    <TableCell>{Boolean(birthDate) && formatDate(new Date(birthDate))}</TableCell>
                                    <TableCell>{phoneNumber}</TableCell>
                                    <TableCell>{additionalPhoneNumber}</TableCell>
                                    <TableCell>{isolationCity}</TableCell>
                                </TableRow>
                            )
                        }
                    })
                }
        </TableBody>
    )
}

interface Props {
    events : ContactNode[];
    existingIds: string[];
}

export default TableRows
