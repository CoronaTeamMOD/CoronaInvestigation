import {useSelector} from 'react-redux';
import {useEffect, useState} from 'react';

import axios from 'Utils/axios';
import theme from 'styles/theme';
import logger from 'logger/logger';
import {Severity} from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import InvolvedContact from 'models/InvolvedContact';
import { useDateUtils } from 'Utils/DateUtils/useDateUtils';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import InvolvementReason from 'models/enums/InvolvementReason';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import useGoogleApiAutocomplete from 'commons/LocationInputField/useGoogleApiAutocomplete';

import {useInteractionsTabOutcome, useInteractionsTabParameters} from './useInteractionsTabInterfaces';

const eventDeleteFailedMsg = 'לא הצלחנו למחוק את האירוע, אנא נסה שוב בעוד כמה דקות';
const contactDeleteFailedMsg = 'לא הצלחנו למחוק את המגע, אנא נסה שוב בעוד כמה דקות';
const settingsSaveFailedMsg = 'לא הצלחנו לשמור את ההעדפה להתעלם מהמגעים, נסו עוד כמה דקות';

interface GroupedInvolvedGroups {
    familyMembers: InvolvedContact[],
    educationMembers: InvolvedContact[],
}

const useInteractionsTab = (parameters: useInteractionsTabParameters): useInteractionsTabOutcome => {
    const { interactions, setInteractions, setAreThereContacts, setDatesToInvestigate,
            setEducationMembers, setFamilyMembers, setInteractionsTabSettings, completeTabChange } = parameters;
    const { convertDate, getDatesToInvestigate} = useDateUtils();
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

        axios.get(`/clinicalDetails/coronaTestDate`).then((res: any) => {
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

    const groupInvolvedContacts = (involvedContacts: InvolvedContact[]) : GroupedInvolvedGroups => {
        return involvedContacts.reduce<GroupedInvolvedGroups>((previous, contact) => {
            if (contact.involvementReason === InvolvementReason.FAMILY) {
                return {
                    familyMembers: [...previous.familyMembers, contact],
                    educationMembers: previous.educationMembers
                }
            } else if (contact.involvementReason === InvolvementReason.EDUCATION) {
                return {
                    educationMembers: [...previous.educationMembers, contact],
                    familyMembers: previous.familyMembers
                }
            }
            return previous;
        }, {familyMembers: [], educationMembers: []});
    }

    const loadInvolvedContacts = () => {
        const loadInvolvedContactsLogger = logger.setup({
          workflow: 'loading involved contacts',
          investigation: epidemiologyNumber,
          user: userId
        });
        loadInvolvedContactsLogger.info('launching db request', Severity.LOW);
        axios.get(`/intersections/involvedContacts/${epidemiologyNumber}`)
        .then((result) => {
            if (result?.data && result.headers['content-type'].includes('application/json')) {
                loadInvolvedContactsLogger.info('got response successfully', Severity.LOW);
                const involvedContacts : InvolvedContact[] = result?.data;
                const { familyMembers, educationMembers } = groupInvolvedContacts(involvedContacts);
                setFamilyMembers(familyMembers);
                setEducationMembers(educationMembers);
            } else {
                loadInvolvedContactsLogger.error(`failed to get response due to ${result}`, Severity.HIGH);
            }
        }).catch((error) => {
            loadInvolvedContactsLogger.error(`failed to get response due to ${error}`, Severity.HIGH);
        });
    }

    const getInteractionsTabSettings = () => {
        const interactionsTabSettingsLogger = logger.setup({
            workflow: 'fetching interactions tab settings data',
            investigation: epidemiologyNumber,
            user: userId
          });
          interactionsTabSettingsLogger.info('launching db request', Severity.LOW);
          axios.get(`/investigationInfo/interactionsTabSettings/${epidemiologyNumber}`)
          .then((result) => {
              if (result?.data) {
                  interactionsTabSettingsLogger.info('got response successfully', Severity.LOW);
                  setInteractionsTabSettings(result?.data);
              } else {
                  interactionsTabSettingsLogger.error(`failed to get response due to ${result}`, Severity.HIGH);
              }
          }).catch((error) => {
              interactionsTabSettingsLogger.error(`failed to get response due to ${error}`, Severity.HIGH);
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
        loadInvolvedContacts();
        getCoronaTestDate();
        getClinicalDetailsSymptoms();
        getInteractionsTabSettings();
    }, []);

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
                axios.delete('/intersections/deleteContactEvent', {params: {contactEventId}}).then(() => {
                    deletingInteractionsLogger.info('interaction was deleted successfully', Severity.LOW)
                    setInteractions(interactions.filter((interaction: InteractionEventDialogData) => interaction.id !== contactEventId));
                }).catch((error) => {
                    deletingInteractionsLogger.error(`got errors in server result: ${error}`, Severity.HIGH);
                    alertError(eventDeleteFailedMsg);
                })
            }
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

    const saveInvestigaionSettingsFamily = () => {
        const saveInvestigaionSettingsLogger = logger.setup({
            workflow: 'Saving investigaion settings family data',
            investigation: epidemiologyNumber,
            user: userId
        });
        axios.post('/investigationInfo/investigationSettingsFamily', {
            id: epidemiologyNumber,
            allowUncontactedFamily: true,
        }).then(() => {
            saveInvestigaionSettingsLogger.info('saved to db successfully', Severity.LOW);
            completeTabChange();
        }).catch((error) => {
            saveInvestigaionSettingsLogger.error(`got errors in server result: ${error}`, Severity.HIGH);
            alertError(settingsSaveFailedMsg);
        })
    }

    return {
        loadInteractions,
        handleDeleteContactEvent,
        handleDeleteContactedPerson,
        saveInvestigaionSettingsFamily
    }
};

export default useInteractionsTab;