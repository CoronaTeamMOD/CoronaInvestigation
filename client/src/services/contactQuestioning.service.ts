import { Subject } from 'rxjs';
import { store } from 'redux/store';
import ContactFromAboardCodes from 'models/enums/ContactFromAboardCodes';
import TabNames from 'models/enums/TabNames';
const duplicateIdentitySubject = new Subject<IdentityData[]>();

const checkForDuplicates = () => {
    const interactedContacts = store.getState().interactedContacts.interactedContacts;
    let result = [];
    for (var i = 0; i < interactedContacts.length; i++) {
        let contact = interactedContacts[i];
        if (contact.identificationType && contact.identificationNumber && contact.identificationNumber !== "") {
            let identificationType = contact.identificationType?.id || contact.identificationType;
            let index = interactedContacts.findIndex(obj => (obj.identificationType === identificationType || obj.identificationType?.id === identificationType) && obj.identificationNumber === contact.identificationNumber)
            if (index !== i)
                result.push(new IdentityData(identificationType as number, contact.identificationNumber));
        }
    }
    duplicateIdentitySubject.next(result);
}

export const contactQuestioningService = {
    resetIdentityValidation: () => {
        duplicateIdentitySubject.next([]);
    },
    getDuplicateIdentities: () => duplicateIdentitySubject.asObservable(),
   checkForDuplicates: checkForDuplicates
};

export const checkForContactsFromAboardId = (tab: TabNames) => {
    if (tab == TabNames.CONTACT_QUESTIONING) {
        const interactedContacts = store.getState().interactedContacts.interactedContacts;
        return interactedContacts.filter(contact=>contact.isStayAnotherCountry === true).length > 0 ? ContactFromAboardCodes.CONTACT_FROM_ABOARD : ContactFromAboardCodes.NO_CONTACT_FROM_ABOARD;
    }
    else if (tab == TabNames.INTERACTIONS) {
        const interactions = store.getState().interactionEvents.interactionEvents;
        const currentContactFromAbroadId = store.getState().investigation.contactFromAboardId;
        let contactsCount = 0;
        let contactFromAboardCount = 0;
        interactions.forEach(event =>{
            contactsCount += event.contacts.length;
            contactFromAboardCount+=event.contacts.filter(contact=>contact.isStayAnotherCountry == true).length;         
        });
        return contactFromAboardCount > 0 ?
            ContactFromAboardCodes.CONTACT_FROM_ABOARD :
            currentContactFromAbroadId != ContactFromAboardCodes.OPTIONAL_CONTACT_FROM_ABOARD ?
                ContactFromAboardCodes.NO_CONTACT_FROM_ABOARD :
                null;
    }
}
class IdentityData {
    identityType: number;
    identityNumber: string;

    constructor(identityType: number, identityNumber: string) {
        this.identityType = identityType;
        this.identityNumber = identityNumber;
    }
}

