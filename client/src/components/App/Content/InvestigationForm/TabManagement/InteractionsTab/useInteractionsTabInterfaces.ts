import { InteractionEventVariables } from './NewInteractionEventDialog/InteractionEventVariables';
import { StartInvestigationDateVariables } from '../../StartInvestigationDateVariables/StartInvestigationDateVariables';

export interface useInteractionsTabInput {
    setNewInteractionEventId: React.Dispatch<React.SetStateAction<number | undefined>>
};

export interface useInteractionsTabOutcome {
    getDatesToInvestigate: (startInvestigationDateVariables: StartInvestigationDateVariables) => Date[];
    createNewInteractionEvent: (eventDate: Date) => void;
    confirmNewInteractionEvent: (interactionEventVariables: InteractionEventVariables) => void;
    cancleNewInteractionEvent: (eventId: number) => void;
};