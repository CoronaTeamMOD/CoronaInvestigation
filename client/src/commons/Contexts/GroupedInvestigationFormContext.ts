import { createContext } from 'react';

export interface GroupedInvestigationContext {
    groupedInvestigationContacts: number[];
    setGroupedInvestigationContacts: React.Dispatch<React.SetStateAction<number[]>>;
    eventContactIds?: (string | undefined)[];
};

export const initialContacts: GroupedInvestigationContext = {
    groupedInvestigationContacts: [],
    setGroupedInvestigationContacts: () => {},
    eventContactIds: []
};

export const groupedInvestigationsContext = createContext<GroupedInvestigationContext>(initialContacts);
export const GroupedInvestigationsContextProvider = groupedInvestigationsContext.Provider;