import React , { useState } from 'react'

import { IdToCheck } from 'Utils/Contacts/useDuplicateContactId';
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
    const { groupId, groupedInvestigationContacts, setGroupedInvestigationContacts, allContactIds} = props;

    const [contacts, setContacts] = useState<ConnectedInvestigationContact>(initialState);
    const nodes = contacts.investigationsByGroupId.nodes;

    useGroupedInvestigationsTab({groupId , setContacts});

    return (
        nodes === []
            ? <ErrorMessage
                text={noContactsText}
              />
            : <ContactsForm 
                contacts={nodes}
                reason={contacts.otherReason||contacts.investigationGroupReasonByReason.displayName}
                groupedInvestigationContacts={groupedInvestigationContacts}
                setGroupedInvestigationContacts={setGroupedInvestigationContacts}
                allContactIds={allContactIds}
            />
    )
}

interface Props {
    groupId : string;
    groupedInvestigationContacts: number[]; 
    setGroupedInvestigationContacts:  React.Dispatch<React.SetStateAction<number[]>>;
    allContactIds: IdToCheck[];
}

export default GroupedInvestigationForm
