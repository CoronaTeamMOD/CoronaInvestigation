import Interaction from 'models/Contexts/InteractionEventDialogData';

import { StartInvestigationDateVariables } from '../../StartInvestigationDateVariables/StartInvestigationDateVariables';

export interface useInteractionsTabInput {
    interactions: Map<number, Interaction[]>;
    setInteractions: React.Dispatch<React.SetStateAction<Map<number, Interaction[]>>>;
};

export interface useInteractionsTabOutcome {
    getDatesToInvestigate: (startInvestigationDateVariables: StartInvestigationDateVariables) => Date[];
    loadInteractions: () => void;
};