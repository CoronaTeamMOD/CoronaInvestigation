import React from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { subDays, eachDayOfInterval } from 'date-fns';

import axios from 'Utils/axios';
import theme from 'styles/theme';
import StoreStateType from 'redux/storeStateType';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import useGoogleApiAutocomplete from "commons/LocationInputField/useGoogleApiAutocomplete";

import { useInteractionsTabOutcome, useInteractionsTabInput } from './useInteractionsTabInterfaces';
import useStyles from './InteractionsTabStyles';

const symptomsWithKnownStartDate: number = 4;
const nonSymptomaticPatient: number = 7;
const symptomsWithUnknownStartDate: number = 10;

const convertDate = (dbDate: Date | null) => dbDate === null ? null : new Date(dbDate);

const useInteractionsTab = ({ interactions, setInteractions }: useInteractionsTabInput) :  useInteractionsTabOutcome => {
    const { parseAddress } = useGoogleApiAutocomplete();

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const classes = useStyles({});

    const getCoronaTestDate = (setTestDate: React.Dispatch<React.SetStateAction<Date | null>>, setInvestigationStartTime: React.Dispatch<React.SetStateAction<Date | null>>) => {
        axios.get('/clinicalDetails/coronaTestDate').then((res: any) => {
            if(res.data !== null) {
                setTestDate(convertDate(res.data.coronaTestDate));
                setInvestigationStartTime(convertDate(res.data.startTime));
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

    const getClinicalDetails = (setSymptomsStartDate: React.Dispatch<React.SetStateAction<Date | null>>, setDoesHaveSymptoms: React.Dispatch<React.SetStateAction<boolean>>) => {
        axios.get(`/clinicalDetails/getInvestigatedPatientClinicalDetailsFields?epidemiologyNumber=${epidemiologyNumber}`).then(
            result => {
                if (result?.data?.data?.investigationByEpidemiologyNumber) {
                    const clinicalDetailsByEpidemiologyNumber = result.data.data.investigationByEpidemiologyNumber.investigatedPatientByInvestigatedPatientId;
                    const patientInvestigation = clinicalDetailsByEpidemiologyNumber.investigationsByInvestigatedPatientId.nodes[0];
                    setSymptomsStartDate(convertDate(patientInvestigation.symptomsStartTime));
                    setDoesHaveSymptoms(patientInvestigation.doesHaveSymptoms? true : false);
                }
            });
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

    const convertDBInteractionToInteraction = (dbInteraction: any): InteractionEventDialogData => {
        return ({
            ...dbInteraction,
            locationAddress: parseAddress(dbInteraction.locationAddress) || '',
            startTime: new Date(dbInteraction.startTime),
            endTime: new Date(dbInteraction.endTime),
        })
    }

    const handleLoadInteractionsError = () => {
        Swal.fire({
            title: 'הייתה שגיאה בטעינת האירועים והמגעים',
            icon: 'error',
            customClass: {
                title: classes.swalTitle
            }
        });
    }

    const handleDeleteContactEvent = (contactEventId: number) => {
        Swal.fire({
            icon: 'warning',
            title: 'האם אתה בטוח שתרצה למחוק את האירוע?',
            text: 'שים לב, בעת מחיקת האירוע ימחקו כל המגעים שנכחו בו',
            showCancelButton: true,
            cancelButtonText: 'בטל',
            cancelButtonColor: theme.palette.error.main,
            confirmButtonColor: theme.palette.primary.main,
            confirmButtonText: 'כן, המשך',
            customClass: {
                title: classes.swalTitle,
                content: classes.swalText
            }
        }).then((result) => {
            if (result.value) {
                axios.delete('/intersections/deleteContactEvent', {
                    params: {contactEventId}
                }).then(() => {
                    setInteractions(interactions.filter(interaction => interaction.id !== contactEventId));
                }).catch(() => {
                    handleDeleteEventFailed();
                })
            };
        });

        const handleDeleteEventFailed = () => {
            Swal.fire({
                title: 'לא הצלחנו למחוק את האירוע, אנא נסה שוב בעוד כמה דקות',
                icon: 'error',
                customClass: {
                    title: classes.swalTitle
                }
            })
        };
    }

    return {
        getClinicalDetails,
        getCoronaTestDate,
        getDatesToInvestigate,
        loadInteractions,
        handleDeleteContactEvent,
    }
};

export default useInteractionsTab;