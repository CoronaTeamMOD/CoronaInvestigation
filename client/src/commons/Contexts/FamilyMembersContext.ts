import { createContext } from 'react';

import InvolvedContact from 'models/InvolvedContact';

export interface FamilyMembersContext {
    familyMembers: InvolvedContact[];
    eventFamilyMembersIds?: (string | undefined)[];
};

const initialFamilyMembers: FamilyMembersContext = {
    familyMembers: [],
    eventFamilyMembersIds: []
};

export const familyMembersContext = createContext<FamilyMembersContext>(initialFamilyMembers);
export const FamilyMembersDataContextProvider = familyMembersContext.Provider;
