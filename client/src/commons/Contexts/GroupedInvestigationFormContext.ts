import { createContext } from 'react';

export interface GroupedInvestigationContext {
    groupedInvestigationContacts: number[];
    setGroupedInvestigationContacts: React.Dispatch<React.SetStateAction<number[]>>;
};

export const initialContacts: GroupedInvestigationContext = {
    groupedInvestigationContacts: [],
    setGroupedInvestigationContacts: () => {}
};

export const groupedInvestigationsContext = createContext<GroupedInvestigationContext>(initialContacts);
export const GroupedInvestigationsContextProvider = groupedInvestigationsContext.Provider;