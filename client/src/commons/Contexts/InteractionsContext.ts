import { createContext } from 'react';

import Interaction from 'models/Contexts/InteractionEventDialogData';

export interface InteractionsData {
    interactions: Interaction[];
};

const initialInteractionsContext: InteractionsData = {
    interactions: []
};

export const interactionsDataContext = createContext<InteractionsData>(initialInteractionsContext);
export const InteractionsDataContextProvider = interactionsDataContext.Provider;
