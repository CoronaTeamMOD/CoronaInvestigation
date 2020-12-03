import { createContext } from 'react';

import InvolvedContact from 'models/InvolvedContact';

export interface FamilyMembersContext {
    familyMembers: InvolvedContact[];
};

const initialFamilyMembers: FamilyMembersContext = {
    familyMembers: []
};

export const familyMembersContext = createContext<FamilyMembersContext>(initialFamilyMembers);
export const FamilyMembersDataContextProvider = familyMembersContext.Provider;
