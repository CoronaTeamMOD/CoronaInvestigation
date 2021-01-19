import React , { useState } from 'react'

import ConnectedInvestigationContact from 'models/GroupedInvestigationContacts/ConnectedInvestigationContact';

import ContactsForm from './ContactsForm/ContactsForm';
import NoContactsMessage from './NoContactsMessage/NoContactsMessage';
import useGroupedInvestigationsTab from './useGroupedInvestigationForm';
interface Props {
    groupId : string;
}

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
    const nodes = contacts.investigationsByGroupId.nodes;

    useGroupedInvestigationsTab({groupId , setContacts});

    return (
        nodes === []
            ? <NoContactsMessage />
            : <ContactsForm 
                contacts={nodes}
                reason={contacts.investigationGroupReasonByReason.displayName}/>
    )
}

export default GroupedInvestigationForm
