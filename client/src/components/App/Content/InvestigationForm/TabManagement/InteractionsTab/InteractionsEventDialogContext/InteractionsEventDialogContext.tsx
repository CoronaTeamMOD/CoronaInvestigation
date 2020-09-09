import React, { createContext } from 'react';

import {initAddress} from 'models/Address';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData'
import Contact from 'models/Contact';

export interface InteractionsEventDialogDataAndSet {
    interactionEventDialogData: InteractionEventDialogData,
    setInteractionEventDialogData: React.Dispatch<React.SetStateAction<InteractionEventDialogData>>
}
export const initialDialogData = (locationType: string,
                                  startTime: Date,
                                  endTime: Date,
                                  contacts: Contact[],
                                  investigationId: number,) : InteractionEventDialogData => ({
    locationType,
    investigationId,
    locationAddress: initAddress,
    startTime,
    endTime,
    externalizationApproval: false,
    contacts,
    locationSubType: 0,
    contactedNumber: contacts.length,
})

const initialInteractionEventDialogDataContext: InteractionsEventDialogDataAndSet = {
    interactionEventDialogData: initialDialogData('', new Date(), new Date(), [], -1),
    setInteractionEventDialogData: () => {},
}

export const InteractionEventDialogContext = createContext<InteractionsEventDialogDataAndSet>(initialInteractionEventDialogDataContext);
export const InteractionEventDialogProvider = InteractionEventDialogContext.Provider;