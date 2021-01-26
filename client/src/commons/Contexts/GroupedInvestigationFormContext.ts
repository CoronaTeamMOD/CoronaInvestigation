import { createContext } from 'react';

import { IdToCheck } from 'Utils/Contacts/useDuplicateContactId';

export interface GroupedInvestigationContext {
    groupedInvestigationContacts: number[]; 
    allContactIds: IdToCheck[];
};

const initialContacts: GroupedInvestigationContext = {
    groupedInvestigationContacts: [],
    allContactIds: []
};

export const groupedInvestigationsContext = createContext<GroupedInvestigationContext>(initialContacts);
export const GroupedInvestigationsContextProvider = groupedInvestigationsContext.Provider;