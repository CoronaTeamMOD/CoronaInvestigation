import { subDays, eachDayOfInterval, max } from 'date-fns';

import InteractionEventVariables from 'models/InteractionEventVariables';

import { useInteractionsTabOutcome, useInteractionsTabInput } from './useInteractionsTabInterfaces';
import { StartInvestigationDateVariables } from '../../StartInvestigationDateVariables/StartInvestigationDateVariables';

const investigationDaysBeforeSymptoms: number = 4;
const unsymptomaticInvestigationDaysBeforeConfirmed: number = 7;
const symptomaticInvestigationDaysBeforeConfirmed: number = 10;

const useInteractionsTab = (input: useInteractionsTabInput) :  useInteractionsTabOutcome => {
    
    const { setNewInteractionEventId } = input;

    const getDatesToInvestigate = (startInvestigationDateVariables: StartInvestigationDateVariables) : Date[] => {
        const { exposureDate, hasSymptoms, symptomsStartDate, endInvestigationDate } = startInvestigationDateVariables;
        if (!endInvestigationDate) return [];
        let startInvestigationDate : Date;
        const symptomaticStartInvestigationDate = 
           subDays(endInvestigationDate, symptomaticInvestigationDaysBeforeConfirmed);
        if (hasSymptoms) {
            if (symptomsStartDate) startInvestigationDate = max([subDays(symptomsStartDate, investigationDaysBeforeSymptoms), symptomaticStartInvestigationDate]);
            else startInvestigationDate = subDays(endInvestigationDate, symptomaticInvestigationDaysBeforeConfirmed);
        }
        else if (exposureDate) startInvestigationDate = exposureDate;
        else startInvestigationDate = subDays(endInvestigationDate, unsymptomaticInvestigationDaysBeforeConfirmed);
        return eachDayOfInterval({start: startInvestigationDate, end: endInvestigationDate});
    }

    const createNewInteractionEvent = (eventDate: Date) : void => {
        setNewInteractionEventId(10);
        // TODO: insert the event from db
    }

    const confirmNewInteractionEvent = (interactionEventVariables: InteractionEventVariables) : void => {
        setNewInteractionEventId(undefined);
        // TODO: insert the event from db
    }

    const cancleNewInteractionEvent = (eventId: number) : void => {
        setNewInteractionEventId(undefined);
        // TODO: delete the event from db
    }

    return {        
        getDatesToInvestigate,
        createNewInteractionEvent,
        confirmNewInteractionEvent,
        cancleNewInteractionEvent
    }
};

export default useInteractionsTab;
