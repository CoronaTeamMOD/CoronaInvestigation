import React, { useContext } from 'react'
import { Typography } from '@material-ui/core';

import { groupedInvestigationsContext } from 'commons/Contexts/GroupedInvestigationFormContext';
import ConnectedInvestigation from 'models/GroupedInvestigationContacts/ConnectedInvestigation';

import InvestigationAccordion from './InvestigationAccordion/InvestigationAccordion';

const formHeadline = 'מאומתים המקובצים לחקירה :';

const ContactsForm = (props: Props) => {
    const { investigations, reason, isGroupReasonFamily} = props;
    const { groupedInvestigationContacts } = useContext(groupedInvestigationsContext);
    return (
        <>
            <Typography id="groupingFormHeadline" variant='h5'>{formHeadline}</Typography>
            <Typography id="groupingReason" variant='h6'>{`סיבת הקיבוץ: ${reason}`}</Typography>
            {
                investigations.map((investigation , index) => {
                    return (
                        <InvestigationAccordion
                            key={index}
                            isGroupReasonFamily={isGroupReasonFamily}
                            investigation={investigation}
                        />
                    )
                })
            }
            <Typography id="selectedRowsMsg" variant='h6' align='right'>{`נבחרו עד כה ${groupedInvestigationContacts.length} מגעים משותפים`}</Typography>
        </>
    )
}

interface Props {
    reason : string;
    isGroupReasonFamily: boolean;
    investigations : ConnectedInvestigation[];
}

export default ContactsForm;
