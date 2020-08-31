import { subDays, eachDayOfInterval, max } from 'date-fns';

import { useInteractionsTabOutcome } from './useInteractionsTabInterfaces';
import { StartInvestigationDateVariables } from '../../StartInvestigationDateVariables/StartInvestigationDateVariables';

const investigationDaysBeforeSymptoms: number = 4;
const unsymptomaticInvestigationDaysBeforeConfirmed: number = 7;
const symptomaticInvestigationDaysBeforeConfirmed: number = 10;

const useInteractionsTab = () :  useInteractionsTabOutcome => {
    
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

    return {        
        getDatesToInvestigate
    }
};

export default useInteractionsTab;
