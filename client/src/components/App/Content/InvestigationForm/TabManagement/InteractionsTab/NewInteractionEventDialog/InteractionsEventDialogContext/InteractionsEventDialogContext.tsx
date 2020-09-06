import React, { createContext } from 'react';

import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData'
import {initAddress} from 'models/Address';

interface emptyContext {
    interactionEventDialogData: undefined,
    setInteractionEventDialogData: () => void,
}

export interface InteractionsEventDialogDataAndSet {
    interactionEventDialogData: InteractionEventDialogData,
    setInteractionEventDialogData: React.Dispatch<React.SetStateAction<InteractionEventDialogData>>
}
export const initialDialogData: InteractionEventDialogData = {
    locationType: '',
    locationAddress: initAddress,
    startTime: undefined,
    endTime: undefined,
    externalizationApproval: false,
    grade: '',
}

const initialInteractionEventDialogDataContext: InteractionsEventDialogDataAndSet = {
    interactionEventDialogData: initialDialogData,
    setInteractionEventDialogData: () => {},
}

export const InteractionEventDialogContext = createContext<InteractionsEventDialogDataAndSet | emptyContext>(initialInteractionEventDialogDataContext);
export const InteractionEventDialogProvider = InteractionEventDialogContext.Provider;