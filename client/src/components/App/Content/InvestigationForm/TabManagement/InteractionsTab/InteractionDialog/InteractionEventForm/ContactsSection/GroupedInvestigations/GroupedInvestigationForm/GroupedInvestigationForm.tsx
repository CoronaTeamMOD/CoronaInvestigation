import React , { useState } from 'react'

import ConnectedInvestigationContact from 'models/GroupedInvestigationContacts/ConnectedInvestigationContact';

import ContactsForm from './ContactsForm/ContactsForm';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import useGroupedInvestigationsTab from './useGroupedInvestigationForm';

const noContactsText = 'אין מגעים לחקירות המשותפות';
const initialState = {
    investigationGroupReasonByReason: {
        displayName : "טוען..."
    },
    investigationsByGroupId: {
        nodes : []
    }
}

const GroupedInvestigationForm = (props: Props) => {
    const { groupId } = props;

    const [contacts, setContacts] = useState<ConnectedInvestigationContact>(initialState);
    const {nodes} = contacts.investigationsByGroupId;

    useGroupedInvestigationsTab({groupId , setContacts});

    return (
        nodes === []
            ? <ErrorMessage
                text={noContactsText}
              />
            : <ContactsForm 
                investigations={nodes}
                reason={contacts.otherReason||contacts.investigationGroupReasonByReason.displayName}
            />
    )
}

interface Props {
    groupId : string;
}

export default GroupedInvestigationForm
