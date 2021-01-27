import { createContext } from 'react';

import { IdToCheck } from 'Utils/Contacts/useDuplicateContactId';

export interface GroupedInvestigationContext {
    groupedInvestigationContacts: number[];
    setGroupedInvestigationContacts: React.Dispatch<React.SetStateAction<number[]>>;
    allContactIds: IdToCheck[];
};

const initialContacts: GroupedInvestigationContext = {
    groupedInvestigationContacts: [],
    setGroupedInvestigationContacts: () => {},
    allContactIds: []
};

export const groupedInvestigationsContext = createContext<GroupedInvestigationContext>(initialContacts);
export const GroupedInvestigationsContextProvider = groupedInvestigationsContext.Provider;