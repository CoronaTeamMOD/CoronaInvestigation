import { Typography } from '@material-ui/core';
import React from 'react'

import { ConnectedInvestigation } from '../ConnectedInvestigationContact'

const formHeadline = 'מאומתים המקובצים לחקירה :';

const ContactsForm = (props: Props) => {
    const { contacts , reason} = props;
    return (
        <>
            <Typography variant='h5'>{formHeadline}</Typography>
            <Typography variant='h6'>{`סיבת הקיבוץ: ${reason}`}</Typography>
            {/* <InvestigationAccordion>
            
            </InvestigationAccordion> */}
        </>
    )
}

interface Props {
    reason : string;
    contacts : ConnectedInvestigation[];
}

export default ContactsForm
