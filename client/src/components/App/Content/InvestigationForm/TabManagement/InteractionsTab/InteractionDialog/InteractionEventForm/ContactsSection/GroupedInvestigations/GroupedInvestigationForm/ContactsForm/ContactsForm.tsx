import React , {useState} from 'react'
import { Typography } from '@material-ui/core';

import ConnectedInvestigation from 'models/GroupedInvestigationContacts/ConnectedInvestigation';

import InvestigationAccordion from './InvestigationAccordion/InvestigationAccordion';

const formHeadline = 'מאומתים המקובצים לחקירה :';

const ContactsForm = (props: Props) => {
    const { contacts , reason ,groupedInvestigationContacts, setGroupedInvestigationContacts} = props;

    return (
        <>
            <Typography variant='h5'>{formHeadline}</Typography>
            <Typography variant='h6'>{`סיבת הקיבוץ: ${reason}`}</Typography>
            {
                contacts.map((contact , index) => {
                    return (
                        <InvestigationAccordion
                            key={index}
                            contact={contact}
                            selectedRows={groupedInvestigationContacts}
                            setSelectedRows={setGroupedInvestigationContacts}
                        />
                    )
                })
            }
            <Typography variant='h6' align='right'>{`נבחרו ${groupedInvestigationContacts.length} שורות`}</Typography>
        </>
    )
}

interface Props {
    reason : string;
    contacts : ConnectedInvestigation[];
    groupedInvestigationContacts: number[]; 
    setGroupedInvestigationContacts:  React.Dispatch<React.SetStateAction<number[]>>;
}

export default ContactsForm
