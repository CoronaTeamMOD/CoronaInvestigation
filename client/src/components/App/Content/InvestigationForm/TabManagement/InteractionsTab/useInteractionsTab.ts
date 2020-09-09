import { subDays, eachDayOfInterval, max } from 'date-fns';

import axios from 'Utils/axios';

import { useInteractionsTabOutcome, useInteractionsTabInput } from './useInteractionsTabInterfaces';
import { StartInvestigationDateVariables } from '../../StartInvestigationDateVariables/StartInvestigationDateVariables';

const investigationDaysBeforeSymptoms: number = 4;
const unsymptomaticInvestigationDaysBeforeConfirmed: number = 7;
const symptomaticInvestigationDaysBeforeConfirmed: number = 10;

const useInteractionsTab = (props: useInteractionsTabInput):  useInteractionsTabOutcome => {
    
    const { interactions, setInteractions } = props;
    
    const getDatesToInvestigate = (startInvestigationDateVariables: StartInvestigationDateVariables) : Date[] => {
        const { hasSymptoms, symptomsStartDate, endInvestigationDate } = startInvestigationDateVariables;
        if (!endInvestigationDate) return [];
        let startInvestigationDate : Date;
        const symptomaticStartInvestigationDate =
            subDays(endInvestigationDate, symptomaticInvestigationDaysBeforeConfirmed);
        if (hasSymptoms) {
            if (symptomsStartDate) startInvestigationDate = max([subDays(symptomsStartDate, investigationDaysBeforeSymptoms), symptomaticStartInvestigationDate]);
            else startInvestigationDate = subDays(endInvestigationDate, symptomaticInvestigationDaysBeforeConfirmed);
        }
        else startInvestigationDate = subDays(endInvestigationDate, unsymptomaticInvestigationDaysBeforeConfirmed);
        return eachDayOfInterval({start: startInvestigationDate, end: endInvestigationDate});
    }

    const loadInteractions = () => {
        // TODO: add loading from DB
        axios.get('/intersections?epidemioligyNumber=111').then(res => console.log(res));
    }

    return {        
        getDatesToInvestigate,
        loadInteractions
    }
};

export default useInteractionsTab;