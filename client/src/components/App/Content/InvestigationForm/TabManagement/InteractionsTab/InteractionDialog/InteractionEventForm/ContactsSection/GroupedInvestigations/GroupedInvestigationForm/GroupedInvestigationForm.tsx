import React , { useState } from 'react'

import ContactsForm from './ContactsForm/ContactsForm';
import NoContactsMessage from './NoContactsMessage/NoContactsMessage';
import useGroupedInvestigationsTab from './useGroupedInvestigationForm';
import ConnectedInvestigationContact from './ConnectedInvestigationContact';
interface Props {
    groupId : string;
}

const initialState = {
    investigationGroupReasonByReason: {
        displayName : "טוען..."
    },
    nodes : []
}

const GroupedInvestigationForm = (props: Props) => {
    const [contacts, setContacts] = useState<ConnectedInvestigationContact>(initialState);
    const { groupId } = props;
    useGroupedInvestigationsTab({groupId , setContacts});
    return (
        contacts.nodes === []
            ? <NoContactsMessage />
            : <ContactsForm 
                contacts={contacts.nodes}
                reason={contacts.investigationGroupReasonByReason.displayName}/>
    )
}

export default GroupedInvestigationForm
