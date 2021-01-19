import { Typography } from '@material-ui/core';
import React from 'react'

import { ConnectedInvestigation } from '../ConnectedInvestigationContact';
import InvestigationAccordion from './InvestigationAccordion/InvestigationAccordion';

const formHeadline = 'מאומתים המקובצים לחקירה :';

const ContactsForm = (props: Props) => {
    const { contacts , reason } = props;
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
                        />
                    )
                })
            }
        </>
    )
}

interface Props {
    reason : string;
    contacts : ConnectedInvestigation[];
}

export default ContactsForm
