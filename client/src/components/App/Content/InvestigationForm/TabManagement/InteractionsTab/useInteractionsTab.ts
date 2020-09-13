import {useSelector} from 'react-redux';
import { subDays, eachDayOfInterval, max } from 'date-fns';

import axios from 'Utils/axios';
import Contact from 'models/Contact';
import StoreStateType from 'redux/storeStateType';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import { useInteractionsTabOutcome, useInteractionsTabInput } from './useInteractionsTabInterfaces';

import { StartInvestigationDateVariables } from '../../StartInvestigationDateVariables/StartInvestigationDateVariables';

const investigationDaysBeforeSymptoms: number = 4;
const unsymptomaticInvestigationDaysBeforeConfirmed: number = 7;
const symptomaticInvestigationDaysBeforeConfirmed: number = 10;

const useInteractionsTab = (props: useInteractionsTabInput) :  useInteractionsTabOutcome => {
    
    const { interactions, setInteractions } = props;
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

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
        axios.get(`/intersections/contactEvent/${epidemiologyNumber}`)
            .then((result) => {
                const fetchedContactEvents: InteractionEventDialogData[] = result.data.map(
                    (eventFromServer: InteractionEventDialogData) => eventFromServer);
                setInteractions(fetchedContactEvents);
            });
    }

    return {        
        getDatesToInvestigate,
        loadInteractions
    }
};

export default useInteractionsTab;