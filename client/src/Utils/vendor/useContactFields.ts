import React from 'react';
import InteractedContact from 'models/InteractedContact';
import Contact from 'models/Contact';

export const COMPLETE_STATUS = 5;
const useContactFields = (contactStatus?: InteractedContact['contactStatus']) => {
    const shouldDisable = (status?: InteractedContact['contactStatus']) => status === COMPLETE_STATUS;

    const isFieldDisabled = React.useMemo(() => shouldDisable(contactStatus), [contactStatus]);

    const getDisabledFields = (contacts: Contact[]) => {
        return contacts.filter((contact) => shouldDisable(contact.contactStatus));
    };

    return {
        isFieldDisabled,
        getDisabledFields
    }
};

export default useContactFields;