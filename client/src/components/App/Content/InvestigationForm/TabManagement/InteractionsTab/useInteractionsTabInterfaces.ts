import Interaction from 'models/Contexts/InteractionEventDialogData';

import { StartInvestigationDateVariables } from '../../StartInvestigationDateVariables/StartInvestigationDateVariables';

export interface useInteractionsTabInput {
    interactions: Interaction[];
    setInteractions: React.Dispatch<React.SetStateAction<Interaction[]>>;
};

export interface useInteractionsTabOutcome {
    getDatesToInvestigate: (startInvestigationDateVariables: StartInvestigationDateVariables) => Date[];
    loadInteractions: () => void;
};