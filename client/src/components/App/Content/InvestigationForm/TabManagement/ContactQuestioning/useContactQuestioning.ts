import axios from 'axios';
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import InteractedContact from 'models/InteractedContact';
import { setFormState } from 'redux/Form/formActionCreators';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';
import GroupedInteractedContact, { GroupedInteractedContactEvent } from 'models/ContactQuestioning/GroupedInteractedContact';

import ContactQuestioningSchema from './ContactSection/Schemas/ContactQuestioningSchema';
import {
    FormInputs,
    useContactQuestioningOutcome,
    useContactQuestioningParameters,
} from './ContactQuestioningInterfaces';

const NEW_CONTACT_STATUS_CODE = 1;

export const SIZE_OF_CONTACTS = 10;

const useContactQuestioning = (parameters: useContactQuestioningParameters): useContactQuestioningOutcome => {
    const {
        id,
        setAllContactedInteractions,
        allContactedInteractions,
        setFamilyRelationships,
        setContactStatuses,
        getValues,
        currentPage,
        setIsMore,
        contactsLength, 
        setContactsLength
    } = parameters;

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const datesToInvestigate = useSelector<StoreStateType, Date[]>(state => state.investigation.datesToInvestigate);

    const { alertError } = useCustomSwal();

    const createSaveContactRequest = (contactsSavingVariable: { unSavedContacts: { contacts: InteractedContact[] } },
        workflowName: string) => {
        const contactLogger = logger.setup(workflowName);

        contactLogger.info(`launching server request with parameter: ${JSON.stringify(contactsSavingVariable)}`, Severity.LOW);
        setIsLoading(true);
        return axios.post('/contactedPeople/interactedContacts', contactsSavingVariable)
            .then((response) => {
                if (response.data?.data?.updateContactPersons) {
                    contactLogger.info('got response from the server', Severity.LOW);
                }
            })
            .catch((err) => {
                contactLogger.error(`got the following error from the server: ${err}`, Severity.HIGH);
                alertError('חלה שגיאה בשמירת הנתונים');
            })
            .finally(() => setIsLoading(false));
    };

    const getRulerApiDataFromServer = async (ids : any []) => {
        const RulerCheckColorRequestParameters = {
            "RulerCheckColorRequest":{     
                "MOHHeader":{       
                    "ActivationID":"1",     
                    "CustID":"23",
                    "AppID":"123",
                    "SiteID":"2",       
                    "InterfaceID":"Ruler"
                },
                "Ids":ids
            }
        }
            
        const rulerLogger = logger.setup('client ruler logger setup');
        rulerLogger.info(`launching server request with parameter: ${JSON.stringify(RulerCheckColorRequestParameters)}`, Severity.LOW);
        setIsLoading(true);
        return await axios.post('/ruler/rulerapi', RulerCheckColorRequestParameters)
        .then((response: any) => {
            if (response?.ColorData) {
                rulerLogger.info('got response from the ruler server', Severity.LOW);
                return response;
            } else {
                alertError('חלה שגיאה בקבלת נתונים משירות הרמזור');
            }
        })
        .catch((err) => {
            rulerLogger.error(`got the following error from the ruler server: ${err}`, Severity.HIGH);
            alertError('חלה שגיאה בקבלת נתונים משירות הרמזור');
            return err;
        })
        .finally(() => setIsLoading(false));
    };

    const saveContact = (interactedContact: InteractedContact): boolean => {
        const contacts = [interactedContact];
        const contactsSavingVariable = {
            unSavedContacts: { contacts },
        };

        createSaveContactRequest(contactsSavingVariable, 'Saving single contact');
        return true;
    };

    const saveContactQuestioning = (parsedFormData: InteractedContact[], originalFormData: FormInputs) => {
        const contactsSavingVariable = {
            unSavedContacts: { contacts: parsedFormData }
        };

        createSaveContactRequest(contactsSavingVariable, 'Saving all contacts')
            .finally(() => {
                ContactQuestioningSchema.isValid(originalFormData).then(valid => {
                    setFormState(epidemiologyNumber, id, valid);
                })
            });
    };

    const loadFamilyRelationships = () => {
        const familyRelationshipsLogger = logger.setup('Getting family relationships')
        familyRelationshipsLogger.info('launching server request', Severity.LOW);
        axios.get('/contactedPeople/familyRelationships').then((result: any) => {
            if (result?.data && result.headers['content-type'].includes('application/json')) {
                familyRelationshipsLogger.info('got respond from the server that has data', Severity.LOW);
                setFamilyRelationships(result?.data);
            } else {
                familyRelationshipsLogger.warn('got respond from the server without data', Severity.MEDIUM);
            }
        }).catch(err => {
            familyRelationshipsLogger.error(`got the following error from the server: ${err}`, Severity.LOW);
        });
    };

    const loadContactStatuses = () => {
        const contactStatusesLogger = logger.setup('Getting contact statuses');
        contactStatusesLogger.info('launching server request', Severity.LOW);
        axios.get('/contactedPeople/contactStatuses')
            .then((result: any) => {
                if (
                    result?.data &&
                    result.headers['content-type'].includes('application/json')
                ) {
                    contactStatusesLogger.info(
                        'got respond from the server that has data',
                        Severity.LOW
                    );
                    setContactStatuses(result.data);
                } else {
                    contactStatusesLogger.warn(
                        'got respond from the server without data',
                        Severity.MEDIUM
                    );
                }
            })
            .catch((err) => {
                contactStatusesLogger.error(
                    `got the following error from the server: ${err}`,
                    Severity.LOW
                );
            });
    };

    const loadInteractedContacts = () => {
        const interactedContactsLogger = logger.setup('Getting contacts');
        interactedContactsLogger.info(
            `launching server request with epidemiology number ${epidemiologyNumber}`,
            Severity.LOW
        );
        setIsLoading(true);
        const minimalDate = datesToInvestigate.slice(-1)[0];

        const requestData = {
            size: SIZE_OF_CONTACTS,
            currentPage
        };

        axios.post(`/contactedPeople/allContacts/${minimalDate?.toISOString()}`,requestData)
            .then((result: any) => {
                if (result?.data && result.headers['content-type'].includes('application/json')) {
                    interactedContactsLogger.info(
                        'got respond from the server that has data',
                        Severity.LOW
                    );

                    let contactsToApi: any[] = [];

                    const interactedContacts: InteractedContact[] = []
                    for (let contact of result.data.convertedContacts) {

                        let idType = !contact.personByPersonInfo.identificationType?.id ? 3 : 
                                       contact.personByPersonInfo.identificationType?.id === 4 ? 3 :
                                       contact.personByPersonInfo.identificationType?.id === 5 ? 4 :
                                       contact.personByPersonInfo.identificationType?.id;
                        contactsToApi.push({
                            idType,
                            IDnum: contact.personByPersonInfo.identificationNumber,
                            DOB: new Date(contact.personByPersonInfo.birthDate).toLocaleDateString(),
                            Tel: contact.personByPersonInfo.phoneNumber  
                        });
                        
                        interactedContacts.push({
                            personInfo: contact.personInfo,
                            placeName: contact.contactEventByContactEvent.placeName,
                            id: contact.id,
                            firstName: contact.personByPersonInfo.firstName,
                            lastName: contact.personByPersonInfo.lastName,
                            phoneNumber: contact.personByPersonInfo.phoneNumber,
                            identificationType: contact.personByPersonInfo.identificationType,
                            identificationNumber: contact.personByPersonInfo.identificationNumber,
                            birthDate: contact.personByPersonInfo.birthDate,
                            additionalPhoneNumber:
                                contact.personByPersonInfo
                                    .additionalPhoneNumber,
                            gender: contact.personByPersonInfo.gender,
                            contactDate:
                                contact.contactEventByContactEvent.startTime,
                            contactEvent: contact.contactEventByContactEvent.id,
                            contactType: contact.contactType,
                            contactStatus: contact.contactStatus ?? NEW_CONTACT_STATUS_CODE,
                            extraInfo: contact.extraInfo,
                            relationship: contact.relationship,
                            familyRelationship: contact.familyRelationship,
                            isolationAddress: contact.isolationAddress,
                            occupation: contact.occupation,
                            doesFeelGood: contact.doesFeelGood !== null
                                ? contact.doesFeelGood
                                : null,
                            doesHaveBackgroundDiseases: contact.doesHaveBackgroundDiseases !== null
                                ? contact.doesHaveBackgroundDiseases
                                : null,
                            doesLiveWithConfirmed: contact.doesLiveWithConfirmed !== null
                                ? contact.doesLiveWithConfirmed
                                : null,
                            doesNeedHelpInIsolation: contact.doesNeedHelpInIsolation !== null
                                ? contact.doesNeedHelpInIsolation
                                : null,
                            repeatingOccuranceWithConfirmed: contact.repeatingOccuranceWithConfirmed !== null
                                ? contact.repeatingOccuranceWithConfirmed
                                : null,
                            doesWorkWithCrowd: contact.doesWorkWithCrowd !== null
                                ? contact.doesWorkWithCrowd
                                : null,
                            doesNeedIsolation: contact.doesNeedIsolation !== null
                                ? contact.doesNeedIsolation
                                : null,
                            creationTime: contact.creationTime,
                            involvementReason: contact.involvementReason,
                            involvedContactId: contact.involvedContactId,
                            finalEpidemiologicalStatusDesc: 'אין נתונים',
                            colorCode: 'אין נתונים',
                            certificateEligibilityTypeDesc: 'אין נתונים',
                            immuneDefinitionBasedOnSerologyStatusDesc: 'אין נתונים',
                            vaccinationStatusDesc: 'אין נתונים',
                            isolationReportStatusDesc: 'אין נתונים',
                            isolationObligationStatusDesc: 'אין נתונים'
                        })
                    };

                    getRulerApiDataFromServer(contactsToApi).then((resultFromAPI) => {
                        if(resultFromAPI?.ColorData) {
                            for (let interactedContact in interactedContacts){
                                interactedContacts[interactedContact].finalEpidemiologicalStatusDesc = resultFromAPI.ColorData[interactedContact]?.finalEpidemiologicalStatusDesc;
                                interactedContacts[interactedContact].colorCode = resultFromAPI.ColorData[interactedContact]?.colorCode;
                                interactedContacts[interactedContact].certificateEligibilityTypeDesc = resultFromAPI.ColorData[interactedContact]?.certificateEligibilityTypeDesc;
                                interactedContacts[interactedContact].immuneDefinitionBasedOnSerologyStatusDesc = resultFromAPI.ColorData[interactedContact]?.immuneDefinitionBasedOnSerologyStatusDesc;
                                interactedContacts[interactedContact].vaccinationStatusDesc = resultFromAPI.ColorData[interactedContact]?.vaccinationStatusDesc;
                                interactedContacts[interactedContact].isolationReportStatusDesc = resultFromAPI.ColorData[interactedContact]?.isolationReportStatusDesc; 
                                interactedContacts[interactedContact].isolationObligationStatusDesc = resultFromAPI.ColorData[interactedContact]?.isolationObligationStatusDesc;
                            }
                        }
                    });
                    
                    setContactsLength(result.data.total);
                    const allContactsSoFar = [...allContactedInteractions, ...interactedContacts];
                    const groupedInteractedContacts = groupSimilarContactedPersons(allContactsSoFar);
                    
                    setAllContactedInteractions(groupedInteractedContacts);

                    if(SIZE_OF_CONTACTS*currentPage >= result.data.total){
                        setIsMore(false);
                    }    
                } else {
                    interactedContactsLogger.warn(
                        'got respond from the server without data',
                        Severity.MEDIUM
                    );
                }
            })
            .catch((err) => {
                interactedContactsLogger.error(
                    `got the following error from the server: ${err}`,
                    Severity.LOW
                );
            })
            .finally(() => setIsLoading(false));
    };

    const checkForSpecificDuplicateIds = (
        identificationNumberToCheck: string,
        interactedContactId: number
    ) => {
        if (Boolean(identificationNumberToCheck)) {
            return (
                allContactedInteractions.findIndex(
                    (contact) =>
                        contact.identificationNumber ===
                        identificationNumberToCheck &&
                        contact.id !== interactedContactId
                ) === -1
            );
        } else {
            return !Boolean(identificationNumberToCheck);
        }
    };

    const checkAllContactsForDuplicateIds = () => {
        const allIdentificationNumbersToCheck = allContactedInteractions.filter(
            (currContact) => Boolean(currContact.identificationNumber)
        );
        return (
            new Set(allIdentificationNumbersToCheck).size ===
            allIdentificationNumbersToCheck.length
        );
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = getValues();
        const parsedFormData = parseFormBeforeSending(data as FormInputs);
        if (!areThereDuplicateIds(data)) {
            parsedFormData && saveContactQuestioning(parsedFormData, data);
        } else {
            alertError('ישנם תזים כפולים בטופס- לא ניתן לשמור');
        }
    };

    const areThereDuplicateIds = (data: FormInputs) => {
        const ids = data.form
            .filter(person => {
                const { identificationNumber, identificationType } = person;
                return identificationNumber && identificationType;
            }).map(person => {
                return `${person.identificationNumber}-${person.identificationType}`
            });

        return ids.length !== new Set(ids).size;
    };

    const parseFormBeforeSending = (data: FormInputs) => {
        const { form } = data;
        const mappedForm = form?.map(
            (person: InteractedContact, index: number) => {
                return parsePerson(person, index);
            }
        ) || [];

        return mappedForm;
    };

    /*
     * The form's state only contains variables that can be edited
     * however, the server expects fields that cannot be edited to be sent (i.e first name)
     * so im parsing the data and adding all of those fields before sending them
     */
    const parsePerson = (person: InteractedContact, index: number) => {
        let updatedPerson = person;
        updatedPerson.contactDate = allContactedInteractions[index].contactDate;
        updatedPerson.contactEvent = allContactedInteractions[index].contactEvent;
        updatedPerson.contactType = allContactedInteractions[index].contactType;
        updatedPerson.creationTime = allContactedInteractions[index].creationTime;
        updatedPerson.firstName = allContactedInteractions[index].firstName;
        updatedPerson.gender = allContactedInteractions[index].gender;
        updatedPerson.id = allContactedInteractions[index].id;
        updatedPerson.personInfo = allContactedInteractions[index].personInfo;
        updatedPerson.involvedContactId = allContactedInteractions[index].involvedContactId;
        updatedPerson.involvementReason = allContactedInteractions[index].involvementReason;
        updatedPerson.lastName = allContactedInteractions[index].lastName;

        return updatedPerson;
    };

    const groupSimilarContactedPersons = (interactedContacts: InteractedContact[]) => {
        let contactsMap = new Map<number, GroupedInteractedContact>();
        interactedContacts.forEach(contact => {
            const { personInfo } = contact;
            if (personInfo) {
                const existingContactType = (contactsMap.get(personInfo)?.contactType);
                const newEvent: GroupedInteractedContactEvent = {
                    date: contact.contactDate,
                    name: contact.placeName || '',
                    contactType: +contact.contactType
                }
                const newEventArr = (contactsMap.get(personInfo)?.contactEvents || []).concat(newEvent);

                contactsMap.set(personInfo, {
                    ...contact,
                    contactType: (existingContactType && +existingContactType === 1) ? existingContactType : contact.contactType,
                    contactEvents: newEventArr,
                });
            }
        });

        return Array.from(contactsMap).map(contact => contact[1]);
    }

    return {
        saveContact,
        loadInteractedContacts,
        loadFamilyRelationships,
        loadContactStatuses,
        checkForSpecificDuplicateIds,
        checkAllContactsForDuplicateIds,
        onSubmit,
        parsePerson,
        getRulerApiDataFromServer
    };
};

export default useContactQuestioning;
