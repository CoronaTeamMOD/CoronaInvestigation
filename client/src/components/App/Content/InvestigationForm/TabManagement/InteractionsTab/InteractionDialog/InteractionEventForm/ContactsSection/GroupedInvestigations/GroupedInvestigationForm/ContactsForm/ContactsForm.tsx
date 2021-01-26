import React from 'react'
import { Typography } from '@material-ui/core';

import { IdToCheck } from 'Utils/Contacts/useDuplicateContactId';
import ConnectedInvestigation from 'models/GroupedInvestigationContacts/ConnectedInvestigation';

import InvestigationAccordion from './InvestigationAccordion/InvestigationAccordion';

const formHeadline = 'מאומתים המקובצים לחקירה :';

const ContactsForm = (props: Props) => {
    const { investigations , reason ,groupedInvestigationContacts, setGroupedInvestigationContacts, allContactIds} = props;

    return (
        <>
            <Typography variant='h5'>{formHeadline}</Typography>
            <Typography variant='h6'>{`סיבת הקיבוץ: ${reason}`}</Typography>
            {
                investigations.map((investigation , index) => {
                    return (
                        <InvestigationAccordion
                            key={index}
                            investigation={investigation}
                            allContactIds={allContactIds}
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
    investigations : ConnectedInvestigation[];
    groupedInvestigationContacts: number[]; 
    setGroupedInvestigationContacts:  React.Dispatch<React.SetStateAction<number[]>>;
    allContactIds: IdToCheck[];
}

export default ContactsForm;
