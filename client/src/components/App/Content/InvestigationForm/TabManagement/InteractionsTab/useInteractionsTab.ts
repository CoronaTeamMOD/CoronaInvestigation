import React from 'react';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { subDays, eachDayOfInterval, differenceInDays } from 'date-fns';

import axios from 'Utils/axios';
import theme from 'styles/theme';
import logger from 'logger/logger';
import StoreStateType from 'redux/storeStateType';
import { Service, Severity } from 'models/Logger';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import useGoogleApiAutocomplete from 'commons/LocationInputField/useGoogleApiAutocomplete';

import useStyles from './InteractionsTabStyles';
import { useInteractionsTabOutcome, useInteractionsTabParameters } from './useInteractionsTabInterfaces';

export const symptomsWithKnownStartDate: number = 4;
export const nonSymptomaticPatient: number = 7;
export const symptomsWithUnknownStartDate: number = 7;
const eventDeleteFailedMsg = 'לא הצלחנו למחוק את האירוע, אנא נסה שוב בעוד כמה דקות';
const contactDeleteFailedMsg = 'לא הצלחנו למחוק את המגע, אנא נסה שוב בעוד כמה דקות';
const maxInvestigatedDays: number = 21;

export const convertDate = (dbDate: Date | null) => dbDate ? new Date(dbDate) : null;

const useInteractionsTab = (parameters: useInteractionsTabParameters): useInteractionsTabOutcome => {
    const { interactions, setInteractions, setAreThereContacts } = parameters;

    const { parseAddress } = useGoogleApiAutocomplete();
    const { alertError } = useCustomSwal();

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const userId = useSelector<StoreStateType, string>(state => state.user.id);

    const classes = useStyles({});

    const getCoronaTestDate = (setTestDate: React.Dispatch<React.SetStateAction<Date | null>>) => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Getting Corona Test Date',
            step: `launching Corona Test Date request`,
            user: userId,
            investigation: epidemiologyNumber
        });

        axios.get(`/clinicalDetails/coronaTestDate/${epidemiologyNumber}`).then((res: any) => {
            if (res.data !== null) {
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Getting Corona Test Date',
                    step: 'got results back from the server',
                    user: userId,
                    investigation: epidemiologyNumber
                });
                setTestDate(convertDate(res.data.coronaTestDate));
            } else {
                logger.warn({
                    service: Service.CLIENT,
                    severity: Severity.HIGH,
                    workflow: 'Getting Corona Test Date',
                    step: 'got status 200 but wrong data'
                });
            }
        })
    }

    const getDatesToInvestigate = (doesHaveSymptoms: boolean, symptomsStartDate: Date | null, coronaTestDate: Date | null): Date[] => {
        if (coronaTestDate !== null) {
            const endInvestigationDate = new Date();
            let startInvestigationDate: Date;
            if (doesHaveSymptoms) {
                if (symptomsStartDate) {
                    const TestAndSymptomsInterval = Math.abs(differenceInDays(symptomsStartDate, coronaTestDate));
                    if (TestAndSymptomsInterval > maxInvestigatedDays) {
                        alertError('תאריך תחילת התסמינים לא חוקי');
                        return []
                    }
                    startInvestigationDate = subDays(symptomsStartDate, symptomsWithKnownStartDate);
                }
                else
                    startInvestigationDate = subDays(coronaTestDate, symptomsWithUnknownStartDate)
            } else {
                startInvestigationDate = subDays(coronaTestDate, nonSymptomaticPatient)
            }
            try {
                return eachDayOfInterval({ start: startInvestigationDate, end: endInvestigationDate });
            } catch (e) {
                return []
            }
        }
        return [];
    }

    const getClinicalDetailsSymptoms = (setSymptomsStartDate: React.Dispatch<React.SetStateAction<Date | null>>, setDoesHaveSymptoms: React.Dispatch<React.SetStateAction<boolean>>) => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Fetching Clinical Details',
            step: 'launching clinical data request',
            user: userId,
            investigation: epidemiologyNumber
        });
        axios.get(`/clinicalDetails/getInvestigatedPatientClinicalDetailsFields?epidemiologyNumber=${epidemiologyNumber}`).then(
            result => {
                if (result?.data) {
                    logger.info({
                        service: Service.CLIENT,
                        severity: Severity.LOW,
                        workflow: 'Fetching Clinical Details',
                        step: 'got results back from the server',
                        user: userId,
                        investigation: epidemiologyNumber
                    });
                    const clinicalDetails = result.data;
                    setDoesHaveSymptoms(clinicalDetails.doesHaveSymptoms);
                    setSymptomsStartDate(convertDate(clinicalDetails.symptomsStartTime));
                } else {
                    logger.warn({
                        service: Service.CLIENT,
                        severity: Severity.HIGH,
                        workflow: 'Fetching Clinical Details',
                        step: 'got status 200 but got invalid outcome'
                    })
                }
            });
    }

    const loadInteractions = () => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Fetching Interactions',
            step: `launching interactions request`,
            user: userId,
            investigation: epidemiologyNumber
        });
        axios.get(`/intersections/contactEvent/${epidemiologyNumber}`)
            .then((result) => {
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Fetching Interactions',
                    step: 'got results back from the server',
                    user: userId,
                    investigation: epidemiologyNumber
                });
                const allInteractions: InteractionEventDialogData[] = result.data.map(convertDBInteractionToInteraction);
                const numberOfContactedPeople = allInteractions.reduce((currentValue: number, interaction: InteractionEventDialogData) => {
                    return currentValue + interaction.contacts.length
                }, 0);
                setAreThereContacts(numberOfContactedPeople > 0);
                setInteractions(allInteractions);
            }).catch((error) => {
                logger.error({
                    service: Service.CLIENT,
                    severity: Severity.HIGH,
                    workflow: 'Fetching Interactions',
                    step: `got errors in server result: ${error}`,
                    user: userId,
                    investigation: epidemiologyNumber
                });
                handleLoadInteractionsError();
            });
    }

    const convertDBInteractionToInteraction = (dbInteraction: any): InteractionEventDialogData => {
        return ({
            ...dbInteraction,
            locationAddress: parseAddress(dbInteraction.locationAddress) || null,
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

    const handleDeleteFailed = (messageToDisplay: string) => {
        Swal.fire({
            title: messageToDisplay,
            icon: 'error',
            customClass: {
                title: classes.swalTitle
            }
        })
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
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Deleting Interaction',
                    step: `launching interaction delete request`,
                    user: userId,
                    investigation: epidemiologyNumber
                });
                axios.delete('/intersections/deleteContactEvent', {
                    params: { contactEventId }
                }).then(() => {
                    logger.info({
                        service: Service.CLIENT,
                        severity: Severity.LOW,
                        workflow: 'Deleting Interaction',
                        step: `interaction was deleted successfully`,
                        user: userId,
                        investigation: epidemiologyNumber
                    });
                    setInteractions(interactions.filter((interaction: InteractionEventDialogData) => interaction.id !== contactEventId));
                }).catch((error) => {
                    logger.error({
                        service: Service.CLIENT,
                        severity: Severity.HIGH,
                        workflow: 'Deleting Interaction',
                        step: `got errors in server result: ${error}`,
                        user: userId,
                        investigation: epidemiologyNumber
                    });
                    handleDeleteFailed(eventDeleteFailedMsg);
                })
            }
            ;
        });
    }

    const handleDeleteContactedPerson = (contactedPersonId: number, contactEventId: number) => {
        Swal.fire({
            icon: 'warning',
            title: 'האם אתה בטוח שתרצה למחוק את מגע?',
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
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Deleting Contacted Person',
                    step: `launching interaction delete request`,
                    user: userId,
                    investigation: epidemiologyNumber
                });
                axios.delete('/intersections/contactedPerson', {
                    params: { contactedPersonId }
                }).then(() => {
                    logger.info({
                        service: Service.CLIENT,
                        severity: Severity.LOW,
                        workflow: 'Deleting Contacted Person',
                        step: `interaction was deleted successfully`,
                        user: userId,
                        investigation: epidemiologyNumber
                    });
                    loadInteractions();
                }).catch((error) => {
                    logger.error({
                        service: Service.CLIENT,
                        severity: Severity.HIGH,
                        workflow: 'Deleting Contacted Person',
                        step: `got errors in server result: ${error}`,
                        user: userId,
                        investigation: epidemiologyNumber
                    });
                    handleDeleteFailed(contactDeleteFailedMsg);
                })
            }
            ;
        });
    }


    return {
        getDatesToInvestigate,
        loadInteractions,
        getCoronaTestDate,
        getClinicalDetailsSymptoms,
        handleDeleteContactEvent,
        handleDeleteContactedPerson
    }
};

export default useInteractionsTab;