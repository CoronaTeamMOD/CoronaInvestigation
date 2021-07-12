import axios from 'axios';
import { format } from 'date-fns';
import logger from 'logger/logger';
import GroupedInteractedContact, { GroupedInteractedContactEvent } from 'models/ContactQuestioning/GroupedInteractedContact';
import InteractedContact from 'models/InteractedContact';
import { Severity } from 'models/Logger';

export const getAllInteractedContacts = async (minimalDate?: Date): Promise<GroupedInteractedContact[]> => {

    try {
        const interactedContactsLogger = logger.setup('Getting contacts');
        const res = await axios.get(`/contactedPeople/allContacts/${minimalDate?.toISOString()}`);
        if (res?.data && res.headers['content-type'].includes('application/json')) {
            let contactsToApi: any[] = [];
            let contactsMap = new Map<number, GroupedInteractedContact>();

            for (let contact of res.data) {
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
                    };
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
                        additionalPhoneNumber: contact.personByPersonInfo.additionalPhoneNumber,
                        gender: contact.personByPersonInfo.gender,
                        contactDate: contact.contactEventByContactEvent.startTime,
                        contactEvent: contact.contactEventByContactEvent.id,
                        contactStatus: contact.contactStatus ?? 1,
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

            const RulerCheckColorRequestParameters = {
                "RulerCheckColorRequest": {
                    "MOHHeader": {
                        "ActivationID": "1",
                        "CustID": "23",
                        "AppID": "123",
                        "SiteID": "2",
                        "InterfaceID": "Ruler"
                    },
                    "Ids": contactsToApi
                }
            }

            const rulerLogger = logger.setup('client ruler logger setup');
            rulerLogger.info(`launching server request with parameter: ${JSON.stringify(RulerCheckColorRequestParameters)}`, Severity.LOW);

            let contacts = Array.from(contactsMap).map(contact => contact[1]);

            try {
                const response = await axios.post('/ruler/rulerapi', RulerCheckColorRequestParameters, { timeout: 5000 });
                if (response.data?.ColorData) {
                    rulerLogger.info('got response from the ruler server', Severity.LOW);
                    if (response.data?.ColorData) {
                        for (let eachResult of response.data?.ColorData) {
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
                    return contacts;

                } else {
                    rulerLogger.error('חלה שגיאה בקבלת נתונים משירות הרמזור', Severity.HIGH);
                    return contacts;
                }
            } catch (err) {
                rulerLogger.error(`got the following error from the ruler server: ${err}`, Severity.HIGH);
                return contacts;
            }
        }
        else {
            interactedContactsLogger.warn('response from server without data', Severity.MEDIUM);
            return [];
        }
    } catch (err) {
        return err;
    }
}

export const updateInteractedContact = async (contact: InteractedContact) => {
    const contactLogger = logger.setup('Saving Single Contact');

    try {
        const contacts = [contact];
        const data = {
            unSavedContacts: {
                contacts
            },
        };
        contactLogger.info(`launching server request with parameter: ${JSON.stringify(data)}`, Severity.LOW);

        const res = await axios.post('/contactedPeople/interactedContacts', data);
        if (res.data?.data?.updateContactPersons) {
            contactLogger.info('got response from the server', Severity.LOW);
            return res.data?.data?.updateContactPersons;
        }
        return res;
    } catch (err) {
        contactLogger.error(`got the following error from the server: ${err}`, Severity.HIGH);
        return err;
    }
}