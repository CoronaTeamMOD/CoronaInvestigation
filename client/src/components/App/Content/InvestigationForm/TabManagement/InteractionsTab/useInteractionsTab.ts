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
const contactDeleteWarningTitle = 'האם אתה בטוח שתרצה למחוק מגע זה?';
const familyContactDeleteWarningText = 'שים לב שבמידה והוא רלוונטי לחקירה, תצטרך להוסיף אותו לאירוע אחר';
const familyContactEventDeleteWarningText = 'שים לב שבמידה ומגעי המשפחה רלוונטיים לחקירה, תצטרך להוסיף אותם לאירוע אחר';
const eventDeleteWarningTitle = 'האם אתה בטוח שתרצה למחוק את האירוע?';
const eventDeleteWarningText = 'שים לב, בעת מחיקת האירוע ימחקו כל המגעים שנכחו בו.';

interface GroupedInvolvedGroups {
    familyMembers: InvolvedContact[];
    educationMembers: InvolvedContact[];
}

const useInteractionsTab = (parameters: useInteractionsTabParameters): useInteractionsTabOutcome => {
    const { interactions, setInteractions, setAreThereContacts, setDatesToInvestigate,
            setEducationMembers, familyMembersStateContext, setInteractionsTabSettings, completeTabChange } = parameters;

    const { parseAddress } = useGoogleApiAutocomplete();
    const { alertError, alertWarning } = useCustomSwal();

    const [coronaTestDate, setCoronaTestDate] = useState<Date | null>(null);
    const [doesHaveSymptoms, setDoesHaveSymptoms] = useState<boolean>(false);
    const [symptomsStartDate, setSymptomsStartDate] = useState<Date | null>(null);

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const { getDatesToInvestigate, convertDate } = useDateUtils();
    
    const getCoronaTestDate = () => {
        const getCoronaTestDateLogger = logger.setup('Getting Corona Test Date');
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
        const getClinicalDetailsSymptomsLogger = logger.setup('Fetching Clinical Details');
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
        const loadInvolvedContactsLogger = logger.setup('loading involved contacts');
        loadInvolvedContactsLogger.info('launching db request', Severity.LOW);
        axios.get(`/intersections/involvedContacts/${epidemiologyNumber}`)
        .then((result) => {
            if (result?.data && result.headers['content-type'].includes('application/json')) {
                loadInvolvedContactsLogger.info('got response successfully', Severity.LOW);
                const involvedContacts : InvolvedContact[] = result?.data.map((involvedContact: any) => ({...involvedContact, isolationCity: involvedContact.city}));
                const { familyMembers, educationMembers } = groupInvolvedContacts(involvedContacts);
                familyMembersStateContext.familyMembers = familyMembers;
                setEducationMembers(educationMembers);
            } else {
                loadInvolvedContactsLogger.error(`failed to get response due to ${result}`, Severity.HIGH);
            }
        }).catch((error) => {
            loadInvolvedContactsLogger.error(`failed to get response due to ${error}`, Severity.HIGH);
        });
    }

    const getInteractionsTabSettings = () => {
        const interactionsTabSettingsLogger = logger.setup('fetching interactions tab settings data');
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
        const loadInteractionsLogger = logger.setup('Fetching Interactions');
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

    const postDeleteLoading = (areFamilyContactsInvolved: boolean) => {
        if (areFamilyContactsInvolved) {
            loadInvolvedContacts();
            getInteractionsTabSettings();
        }
        loadInteractions();
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

    const handleDeleteContactEvent = (contactEventId: number, areThereFamilyContacts: boolean) => {
        const deletingInteractionsLogger = logger.setup('Deleting Interaction');
        alertWarning(eventDeleteWarningTitle,
        {
            text: `${eventDeleteWarningText} ${areThereFamilyContacts ? familyContactEventDeleteWarningText : ''}`,
            showCancelButton: true,
            cancelButtonText: 'בטל',
            cancelButtonColor: theme.palette.error.main,
            confirmButtonColor: theme.palette.primary.main,
            confirmButtonText: 'כן, המשך',
        }).then((result) => {
            if (result.value) {
                deletingInteractionsLogger.info('launching interaction delete request', Severity.LOW);
                axios.delete('/intersections/deleteContactEvent', {
                    params: {contactEventId, investigationId: epidemiologyNumber}
                }).then(() => {
                    deletingInteractionsLogger.info('interaction was deleted successfully', Severity.LOW)
                    postDeleteLoading(areThereFamilyContacts);
                }).catch((error) => {
                    deletingInteractionsLogger.error(`got errors in server result: ${error}`, Severity.HIGH);
                    alertError(eventDeleteFailedMsg);
                })
            }
        });
    }

    const handleDeleteContactedPerson = (contactedPersonId: number, involvedContactId: number | null) => {
        const deleteContactedPersonLogger = logger.setup('Deleting Contacted Person');
        const isThisFamilyContact = Boolean(involvedContactId);
        alertWarning(contactDeleteWarningTitle, {
            text: isThisFamilyContact ? familyContactDeleteWarningText : '',
            showCancelButton: true,
            cancelButtonText: 'בטל',
            cancelButtonColor: theme.palette.error.main,
            confirmButtonColor: theme.palette.primary.main,
            confirmButtonText: 'כן, המשך',
        }).then((result) => {
            if (result.value) {
                deleteContactedPersonLogger.info('launching interaction delete request', Severity.LOW);
                axios.delete('/intersections/contactedPerson', {
                    params: { contactedPersonId,  involvedContactId, investigationId: epidemiologyNumber }
                }).then(() => {
                    deleteContactedPersonLogger.info('interaction was deleted successfully', Severity.LOW);
                    postDeleteLoading(isThisFamilyContact);
                }).catch((error) => {
                    deleteContactedPersonLogger.error(`got errors in server result: ${error}`, Severity.HIGH);
                    alertError(contactDeleteFailedMsg);
                })
            }
            ;
        });
    }

    const saveInvestigaionSettingsFamily = () => {
        const saveInvestigaionSettingsLogger = logger.setup('Saving investigaion settings family data');
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
        loadInvolvedContacts,
        handleDeleteContactEvent,
        handleDeleteContactedPerson,
        saveInvestigaionSettingsFamily
    }
};

export default useInteractionsTab;
