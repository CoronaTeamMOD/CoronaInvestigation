import { Subject } from 'rxjs';
import { store } from 'redux/store';

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

class IdentityData {
    identityType: number;
    identityNumber: string;

    constructor(identityType: number, identityNumber: string) {
        this.identityType = identityType;
        this.identityNumber = identityNumber;
    }
}

