import { createContext } from 'react';

import InteractedContact from 'models/InteractedContact';

export interface interactedContactsContext {
    interactedContacts: InteractedContact[];
};

const initialInteractedContacts: interactedContactsContext = {
    interactedContacts: []
};

export const interactedContactsContext = createContext<interactedContactsContext>(initialInteractedContacts);
export const ClinicalDetailsDataContextProvider = interactedContactsContext.Provider;
