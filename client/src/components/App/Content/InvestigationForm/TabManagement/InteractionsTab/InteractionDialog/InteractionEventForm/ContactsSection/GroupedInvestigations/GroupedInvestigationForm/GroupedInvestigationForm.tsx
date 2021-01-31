import React from 'react'
import { useSelector } from 'react-redux';

import StoreStateType from 'redux/storeStateType';
import ConnectedInvestigationContact from 'models/GroupedInvestigationContacts/ConnectedInvestigationContact';

import ContactsForm from './ContactsForm/ContactsForm';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

const noContactsText = 'אין מגעים לחקירות המשותפות';
const familyReasonId = 100000000;

const GroupedInvestigationForm = () => {
    const investigations = useSelector<StoreStateType , ConnectedInvestigationContact>(state => state.groupedInvestigations.investigations);
    const isGroupReasonFamily = investigations.investigationGroupReasonByReason.id === familyReasonId;
    const nodes = investigations.investigationsByGroupId.nodes;

    return (
        nodes === []
            ? <ErrorMessage
                text={noContactsText}
              />
            : <ContactsForm 
                investigations={nodes}
                isGroupReasonFamily={isGroupReasonFamily}
                reason={investigations.otherReason||investigations.investigationGroupReasonByReason.displayName} />
    )
}

export default GroupedInvestigationForm
