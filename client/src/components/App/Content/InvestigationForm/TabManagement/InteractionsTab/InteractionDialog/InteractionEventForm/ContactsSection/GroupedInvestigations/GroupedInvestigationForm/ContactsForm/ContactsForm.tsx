import React , {useState} from 'react'
import { Typography } from '@material-ui/core';

import ConnectedInvestigation from 'models/GroupedInvestigationContacts/ConnectedInvestigation';

import InvestigationAccordion from './InvestigationAccordion/InvestigationAccordion';

const formHeadline = 'מאומתים המקובצים לחקירה :';

const ContactsForm = (props: Props) => {
    const { contacts , reason } = props;

    const [selectedRows, setSelectedRows] = useState<number[]>([])
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
                            selectedRows={selectedRows}
                            setSelectedRows={setSelectedRows}
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
