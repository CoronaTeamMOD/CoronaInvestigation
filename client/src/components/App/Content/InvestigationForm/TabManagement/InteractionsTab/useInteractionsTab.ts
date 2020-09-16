import React from 'react';
import Swal from 'sweetalert2';
import {useSelector} from 'react-redux';
import { subDays, eachDayOfInterval } from 'date-fns';

import axios from 'Utils/axios';
import { initAddress } from 'models/Address';
import StoreStateType from 'redux/storeStateType';
import { convertDate } from '../ClinicalDetails/useClinicalDetails';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import useGoogleApiAutocomplete from "commons/LocationInputField/useGoogleApiAutocomplete";
import { useInteractionsTabOutcome, useInteractionsTabInput } from './useInteractionsTabInterfaces';

const symptomsWithKnownStartDate: number = 4;
const symptomsWithUnknownStartDate: number = 7;
const nonSymptomaticPatient: number = 10;

const useInteractionsTab = (props: useInteractionsTabInput) :  useInteractionsTabOutcome => {
    const { parseAddress } = useGoogleApiAutocomplete();
    const { interactions, setInteractions } = props;
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const getCoronaTestDate = (setTestDate: React.Dispatch<React.SetStateAction<Date | null>>) => {
        axios.get('/clinicalDetails/coronaTestDate').then((res: any) => {
            if(res.data !== null) {
                setTestDate(convertDate(res.data));
            }
        })
    }

    const getDatesToInvestigate = (doesHaveSymptoms: boolean, symptomsStartDate: Date | null, coronaTestDate: Date | null) : Date[] => {
        if(coronaTestDate !== null) {
            const endInvestigationDate = new Date();
            let startInvestigationDate : Date;
            if (doesHaveSymptoms) {
                if(symptomsStartDate)
                    startInvestigationDate = subDays(symptomsStartDate, symptomsWithKnownStartDate);
                else
                    startInvestigationDate = subDays(coronaTestDate, symptomsWithUnknownStartDate)
            } else {
                startInvestigationDate = subDays(coronaTestDate, nonSymptomaticPatient)
            }
            return eachDayOfInterval({start: startInvestigationDate, end: endInvestigationDate});
        }
        return [];
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

    const parseLocation = (interaction: InteractionEventDialogData) => {
        if (interaction.locationAddress === null) return initAddress;
        if (interaction.locationAddress instanceof String) return JSON.parse(interaction.locationAddress as unknown as string);
        return interaction.locationAddress;
    }

    const convertDBInteractionToInteraction = (dbInteraction: any): InteractionEventDialogData => {
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
        getCoronaTestDate,
        getDatesToInvestigate,
        loadInteractions,
        addNewInteraction,
        updateInteraction,
    }
};

export default useInteractionsTab;