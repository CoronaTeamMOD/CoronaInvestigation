import Interaction from 'models/Contexts/InteractionEventDialogData';

import { StartInvestigationDateVariables } from '../../StartInvestigationDateVariables/StartInvestigationDateVariables';

export interface useInteractionsTabInput {
    interactions: Interaction[];
    setInteractions: (updatedInteractions: Interaction[]) => void;
};

export interface useInteractionsTabOutcome {
    getDatesToInvestigate: (startInvestigationDateVariables: StartInvestigationDateVariables) => Date[];
    loadInteractions: () => void;
    addNewInteraction: (addedInteraction: Interaction) => void;
    updateInteraction: (updatedInteraction: Interaction) => void;
};