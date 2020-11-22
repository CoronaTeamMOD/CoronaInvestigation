import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { subDays, eachDayOfInterval, differenceInDays } from 'date-fns';

import axios from 'Utils/axios';
import theme from 'styles/theme';
import logger from 'logger/logger';
import StoreStateType from 'redux/storeStateType';
import { Severity } from 'models/Logger';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import useGoogleApiAutocomplete from 'commons/LocationInputField/useGoogleApiAutocomplete';

import { useInteractionsTabOutcome, useInteractionsTabParameters } from './useInteractionsTabInterfaces';

export const symptomsWithKnownStartDate: number = 4;
export const nonSymptomaticPatient: number = 7;
export const symptomsWithUnknownStartDate: number = 7;
const eventDeleteFailedMsg = 'לא הצלחנו למחוק את האירוע, אנא נסה שוב בעוד כמה דקות';
const contactDeleteFailedMsg = 'לא הצלחנו למחוק את המגע, אנא נסה שוב בעוד כמה דקות';
const maxInvestigatedDays: number = 21;

export const convertDate = (dbDate: Date | null) => dbDate ? new Date(dbDate) : null;

const useInteractionsTab = (parameters: useInteractionsTabParameters): useInteractionsTabOutcome => {
    const { interactions, setInteractions, setAreThereContacts, setDatesToInvestigate } = parameters;

    const { parseAddress } = useGoogleApiAutocomplete();
    const { alertError, alertWarning } = useCustomSwal();

    const [coronaTestDate, setCoronaTestDate] = useState<Date | null>(null);
    const [doesHaveSymptoms, setDoesHaveSymptoms] = useState<boolean>(false);
    const [symptomsStartDate, setSymptomsStartDate] = useState<Date | null>(null);

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const userId = useSelector<StoreStateType, string>(state => state.user.data.id);

    const getCoronaTestDate = () => {
        const getCoronaTestDateLogger = logger.setup({
            workflow: 'Getting Corona Test Date',
            investigation: epidemiologyNumber,
            user: userId
        });
        getCoronaTestDateLogger.info('launching Corona Test Date request', Severity.LOW);

        axios.get(`/clinicalDetails/coronaTestDate/${epidemiologyNumber}`).then((res: any) => {
            if (res.data !== null) {
                getCoronaTestDateLogger.info('got results back from the server', Severity.LOW);
                setCoronaTestDate(convertDate(res.data.coronaTestDate));
            } else {
                getCoronaTestDateLogger.warn('got status 200 but wrong data', Severity.HIGH);
            }
        })
    }

    const getClinicalDetailsSymptoms = () => {
        const getClinicalDetailsSymptomsLogger = logger.setup({
            workflow: 'Fetching Clinical Details',
            investigation: epidemiologyNumber,
            user: userId
        });
        getClinicalDetailsSymptomsLogger.info('launching clinical data request', Severity.LOW);
        axios.get(`/clinicalDetails/getInvestigatedPatientClinicalDetailsFields?epidemiologyNumber=${epidemiologyNumber}`).then(
            result => {
                if (result?.data) {
                    getClinicalDetailsSymptomsLogger.info('got results back from the server', Severity.LOW);
                    const clinicalDetails = result.data;
                    setDoesHaveSymptoms(clinicalDetails.doesHaveSymptoms);
                    setSymptomsStartDate(convertDate(clinicalDetails.symptomsStartTime));
                } else {
                    getClinicalDetailsSymptomsLogger.warn('got status 200 but got invalid outcome', Severity.HIGH);
                }
            });
    }

    const loadInteractions = () => {
        const loadInteractionsLogger = logger.setup({
            workflow: 'Fetching Interactions',
            investigation: epidemiologyNumber,
            user: userId
        });
        loadInteractionsLogger.info('launching interactions request', Severity.LOW);
        axios.get(`/intersections/contactEvent/${epidemiologyNumber}`)
            .then((result) => {
                loadInteractionsLogger.info('got results back from the server', Severity.LOW);
                const allInteractions: InteractionEventDialogData[] = result.data.map(convertDBInteractionToInteraction);
                const numberOfContactedPeople = allInteractions.reduce((currentValue: number, interaction: InteractionEventDialogData) => {
                    return currentValue + interaction.contacts.length
                }, 0);
                setAreThereContacts(numberOfContactedPeople > 0);
                setInteractions(allInteractions);
            }).catch((error) => {
                loadInteractionsLogger.error(`got errors in server result: ${error}`, Severity.HIGH);
                alertError('הייתה שגיאה בטעינת האירועים והמגעים');
            });
    }

    useEffect(() => {
        loadInteractions();
        getCoronaTestDate();
        getClinicalDetailsSymptoms();
    }, []);

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

    useEffect(() => {
        setDatesToInvestigate(getDatesToInvestigate(doesHaveSymptoms,symptomsStartDate,coronaTestDate));
    }, [coronaTestDate, doesHaveSymptoms, symptomsStartDate]);

    const convertDBInteractionToInteraction = (dbInteraction: any): InteractionEventDialogData => {
        return ({
            ...dbInteraction,
            locationAddress: parseAddress(dbInteraction.locationAddress) || null,
            startTime: new Date(dbInteraction.startTime),
            endTime: new Date(dbInteraction.endTime),
        })
    }

    const handleDeleteContactEvent = (contactEventId: number) => {
        const deletingInteractionsLogger = logger.setup({
            workflow: 'Deleting Interaction',
            investigation: epidemiologyNumber,
            user: userId
        });
        alertWarning('האם אתה בטוח שתרצה למחוק את האירוע?',
        {
            text: 'שים לב, בעת מחיקת האירוע ימחקו כל המגעים שנכחו בו',
            showCancelButton: true,
            cancelButtonText: 'בטל',
            cancelButtonColor: theme.palette.error.main,
            confirmButtonColor: theme.palette.primary.main,
            confirmButtonText: 'כן, המשך',
        }).then((result) => {
            if (result.value) {
                deletingInteractionsLogger.info('launching interaction delete request', Severity.LOW);
                axios.delete('/intersections/deleteContactEvent', {
                    params: { contactEventId }
                }).then(() => {
                    deletingInteractionsLogger.info('interaction was deleted successfully', Severity.LOW);
                    setInteractions(interactions.filter((interaction: InteractionEventDialogData) => interaction.id !== contactEventId));
                }).catch((error) => {
                    deletingInteractionsLogger.error(`got errors in server result: ${error}`, Severity.HIGH);
                    alertError(eventDeleteFailedMsg);
                })
            }
            ;
        });
    }

    const handleDeleteContactedPerson = (contactedPersonId: number, contactEventId: number) => {
        const deleteContactedPersonLogger = logger.setup({
            workflow: 'Deleting Contacted Person',
            investigation: epidemiologyNumber,
            user: userId
        });
        alertWarning('האם אתה בטוח שתרצה למחוק את מגע?', {
            showCancelButton: true,
            cancelButtonText: 'בטל',
            cancelButtonColor: theme.palette.error.main,
            confirmButtonColor: theme.palette.primary.main,
            confirmButtonText: 'כן, המשך',
        }).then((result) => {
            if (result.value) {
                deleteContactedPersonLogger.info('launching interaction delete request', Severity.LOW);
                axios.delete('/intersections/contactedPerson', {
                    params: { contactedPersonId }
                }).then(() => {
                    deleteContactedPersonLogger.info('interaction was deleted successfully', Severity.LOW);
                    loadInteractions();
                }).catch((error) => {
                    deleteContactedPersonLogger.error(`got errors in server result: ${error}`, Severity.HIGH);
                    alertError(contactDeleteFailedMsg);
                })
            }
            ;
        });
    }


    return {
        getDatesToInvestigate,
        loadInteractions,
        handleDeleteContactEvent,
        handleDeleteContactedPerson
    }
};

export default useInteractionsTab;