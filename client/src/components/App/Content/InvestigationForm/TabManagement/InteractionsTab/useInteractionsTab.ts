import Swal from 'sweetalert2';
import {useSelector} from 'react-redux';
import { subDays, eachDayOfInterval, max } from 'date-fns';

import axios from 'Utils/axios';
import StoreStateType from 'redux/storeStateType';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import { useInteractionsTabOutcome, useInteractionsTabInput } from './useInteractionsTabInterfaces';
import { StartInvestigationDateVariables } from '../../StartInvestigationDateVariables/StartInvestigationDateVariables';
import useGoogleApiAutocomplete from "commons/LocationInputField/useGoogleApiAutocomplete";

const investigationDaysBeforeSymptoms: number = 4;
const unsymptomaticInvestigationDaysBeforeConfirmed: number = 7;
const symptomaticInvestigationDaysBeforeConfirmed: number = 10;

const useInteractionsTab = (props: useInteractionsTabInput) :  useInteractionsTabOutcome => {
    const {parseAddress} = useGoogleApiAutocomplete();
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
                const allInteractions: InteractionEventDialogData[] = result.data.map(convertDBInteractionToInteraction);
                setInteractions(allInteractions);
            }).catch(() => {
                handleLoadInteractionsError();
        });
    }

    const loadInteractionById = (eventId: number) => {
        axios.get(`/intersections/contactEventById/${eventId}`)
            .then((result) => {
                if(result.data) {
                    let changedInteraction = result.data;
                    const allInteractions: InteractionEventDialogData[] = [...interactions];
                    let indexOfInteraction = allInteractions.findIndex((interaction) => interaction.id === eventId);
                    const currEvent = convertDBInteractionToInteraction(changedInteraction);
                    if (indexOfInteraction === -1) {
                        allInteractions.push(currEvent);
                    } else {
                        allInteractions.splice(indexOfInteraction, 1, currEvent);
                    }
                    setInteractions(allInteractions);
                }
            }).catch(() => {
                handleLoadInteractionsError();
        });
    }

    const convertDBInteractionToInteraction = (dbInteraction: any): any => {
        return ({
            ...dbInteraction,
            locationAddress: parseAddress(dbInteraction.locationAddress) || '',
            contactPersonPhoneNumber: {number: dbInteraction.contactPersonPhoneNumber === null ? '' : dbInteraction.contactPersonPhoneNumber, isValid: true},
            contacts: dbInteraction.contacts.map((contact: any) => ({...contact, phoneNumber: {number: contact.phoneNumber, isValid: true}})),
            startTime: new Date(dbInteraction.startTime),
            endTime: new Date(dbInteraction.endTime),
        })
    }

    const handleLoadInteractionsError = () => {
        Swal.fire({
            title: 'הייתה שגיאה בטעינת האירועים והמגעים',
            icon: 'error',
        });
    }

    const updateInteraction = (updatedInteraction: InteractionEventDialogData) => {
        loadInteractionById(updatedInteraction.id as number);
    }

    const addNewInteraction = (addedInteraction: InteractionEventDialogData) => {
        loadInteractionById(addedInteraction.id as number);
    }

    return {
        getDatesToInvestigate,
        loadInteractions,
        addNewInteraction,
        updateInteraction,
    }
};

export default useInteractionsTab;