import React from 'react'
import { useSelector } from 'react-redux';

import StoreStateType from 'redux/storeStateType';
import ConnectedInvestigationContact from 'models/GroupedInvestigationContacts/ConnectedInvestigationContact';

import ContactsForm from './ContactsForm/ContactsForm';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

const noContactsText = 'אין מגעים לחקירות המשותפות';

const GroupedInvestigationForm = () => {
    const investigations = useSelector<StoreStateType , ConnectedInvestigationContact>(state => state.groupedInvestigations.investigations)
    const nodes = investigations.investigationsByGroupId.nodes;

    return (
        nodes === []
            ? <ErrorMessage
                text={noContactsText}
              />
            : <ContactsForm 
                investigations={nodes}
                reason={'aaa'}
            />
    )
}

export default GroupedInvestigationForm
