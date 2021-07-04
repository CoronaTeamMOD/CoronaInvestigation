
import axios from 'axios';

import { format } from 'date-fns'

import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import InteractedContact from 'models/InteractedContact';
import GroupedInteractedContact, { GroupedInteractedContactEvent } from 'models/ContactQuestioning/GroupedInteractedContact';
import FamilyRelationship from 'models/FamilyRelationship';
import ContactStatus from 'models/ContactStatus';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';
//

const contactQuestioningData = (epidemiologyNumber:number,datesToInvestigate:Date[] ) => {

    const NEW_CONTACT_STATUS_CODE = 1;
   // const { alertError } = useCustomSwal();
    
    var familyRelationships: FamilyRelationship[] = [];
    var contactStatuses: ContactStatus[] = [];
    var contactList: InteractedContact[] = [];
    
    const getFamilyRelationships = () => {
        if (familyRelationships.length === 0) {
            loadFamilyRelationships().then(() => {
                return familyRelationships;
            })
        }
        else return familyRelationships;
    
    }
    
    const getContactStatuses = () => {
        if (contactStatuses.length === 0) {
            loadContactStatuses().then(() => {
                return contactStatuses;
            })
        }
        else return contactStatuses;
    
    }
    
    const getContacts = () => {
        if (contactList.length === 0) {
            loadInteractedContacts().then(() => {
                return contactList;
            })
        }
        else return contactList;
    
    }
    
    
    
    const loadFamilyRelationships = () => {
        return new Promise(() => {
            const familyRelationshipsLogger = logger.setup('Getting family relationships')
            familyRelationshipsLogger.info('launching server request', Severity.LOW);
            axios.get('/contactedPeople/familyRelationships').then((result: any) => {
                if (result?.data && result.headers['content-type'].includes('application/json')) {
                    familyRelationshipsLogger.info('got respond from the server that has data', Severity.LOW);
                    familyRelationships = result?.data;
    
                } else {
                    familyRelationshipsLogger.warn('got respond from the server without data', Severity.MEDIUM);
                }
            }).catch(err => {
                familyRelationshipsLogger.error(`got the following error from the server: ${err}`, Severity.LOW);
            });
        })
    };
    
    const loadContactStatuses = () => {
        return new Promise(() => {
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
                        contactStatuses = result.data;
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
        })
    };
    
    const loadInteractedContacts = () => {
        return new Promise(() => {
    
    
            const interactedContactsLogger = logger.setup('Getting contacts');
            interactedContactsLogger.info(
                `launching server request with epidemiology number ${epidemiologyNumber}`,
                Severity.LOW
            );
            setIsLoading(true);
            const minimalDate = datesToInvestigate.slice(-1)[0];
    
            axios.get(`/contactedPeople/allContacts/${minimalDate?.toISOString()}`)
                .then((result: any) => {
                    if (result?.data && result.headers['content-type'].includes('application/json')) {
                        interactedContactsLogger.info(
                            'got respond from the server that has data',
                            Severity.LOW
                        );
    
                        let contactsToApi: any[] = [];
    
                        const interactedContacts: InteractedContact[] = [];
                        let contactsMap = new Map<number, GroupedInteractedContact>();
    
                        for (let contact of result.data) {
                            let IdType = !contact.personByPersonInfo.identificationType?.id ? 3 :
                                contact.personByPersonInfo.identificationType?.id === 4 ? 3 :
                                    contact.personByPersonInfo.identificationType?.id === 5 ? 4 :
                                        contact.personByPersonInfo.identificationType?.id;
                            contactsToApi.push({
                                IdType,
                                IDnum: contact.personByPersonInfo.identificationNumber,
                                DOB: format(new Date(contact.personByPersonInfo.birthDate), 'ddMMyyyy'),
                                Tel: contact.personByPersonInfo.phoneNumber
                            });
    
                            if (contact.personInfo) {
                                const existingContactType = (contactsMap.get(contact.personInfo)?.contactType);
                                const newEvent: GroupedInteractedContactEvent = {
                                    date: contact.contactDate,
                                    name: contact.placeName || '',
                                    contactType: +contact.contactType
                                }
                                const newEventArr = (contactsMap.get(contact.personInfo)?.contactEvents || []).concat(newEvent);
    
                                contactsMap.set(contact.personInfo, {
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
                                    isolationObligationStatusDesc: 'אין נתונים',
                                    contactType: (existingContactType && +existingContactType === 1) ? existingContactType : contact.contactType,
                                    contactEvents: newEventArr,
                                });
                            }
                        }
    
                        getRulerApiDataFromServer(contactsToApi).then((resultFromAPI) => {
                            let contacts = Array.from(contactsMap).map(contact => contact[1]);
    
                            if (resultFromAPI?.ColorData) {
                                for (let eachResult of resultFromAPI?.ColorData) {
                                    for (let interactedContact of contacts) {
                                        if (interactedContact.identificationNumber === eachResult.IDnum) {
                                            interactedContact.finalEpidemiologicalStatusDesc = eachResult?.Indicators?.jsonstring?.finalEpidemiologicalStatusDesc;
                                            interactedContact.colorCode = eachResult?.ColorCode;
                                            interactedContact.certificateEligibilityTypeDesc = eachResult?.Indicators?.jsonstring?.certificateEligibilityTypeDesc;
                                            interactedContact.immuneDefinitionBasedOnSerologyStatusDesc = eachResult?.Indicators?.jsonstring?.immuneDefinitionBasedOnSerologyStatusDesc;
                                            interactedContact.vaccinationStatusDesc = eachResult?.Indicators?.jsonstring?.vaccinationStatusDesc;
                                            interactedContact.isolationReportStatusDesc = eachResult?.Indicators?.jsonstring?.isolationReportStatusDesc;
                                            interactedContact.isolationObligationStatusDesc = eachResult?.Indicators?.jsonstring?.isolationObligationStatusDesc;
                                        }
                                    }
                                }
                            }
    
                            contactList = contacts;
                            setIsLoading(false);
                        });
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
        })
    };
    
    const getRulerApiDataFromServer = async (ids: any[]) => {
        const RulerCheckColorRequestParameters = {
            "RulerCheckColorRequest": {
                "MOHHeader": {
                    "ActivationID": "1",
                    "CustID": "23",
                    "AppID": "123",
                    "SiteID": "2",
                    "InterfaceID": "Ruler"
                },
                "Ids": ids
            }
        }
    
        const rulerLogger = logger.setup('client ruler logger setup');
        rulerLogger.info(`launching server request with parameter: ${JSON.stringify(RulerCheckColorRequestParameters)}`, Severity.LOW);
        setIsLoading(true);
        return await axios.post('/ruler/rulerapi', RulerCheckColorRequestParameters, { timeout: 5000 })
            .then((response: any) => {
                if (response.data?.ColorData) {
                    rulerLogger.info('got response from the ruler server', Severity.LOW);
                    return response.data;
                } else {
                   // alertError('חלה שגיאה בקבלת נתונים משירות הרמזור');
                }
            })
            .catch((err) => {
                rulerLogger.error(`got the following error from the ruler server: ${err}`, Severity.HIGH);
               // alertError('חלה שגיאה בקבלת נתונים משירות הרמזור');
                return err;
            })
            .finally(() => setIsLoading(false));
    
    };
    return {
        getContactStatuses,
        getContacts,
        getFamilyRelationships
     };
    };


    export default contactQuestioningData;
