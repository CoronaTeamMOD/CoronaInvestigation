
import { Subject , BehaviorSubject , ReplaySubject} from 'rxjs';
import { store } from 'redux/store';

import GroupedInteractedContact from 'models/ContactQuestioning/GroupedInteractedContact';

var duplicateIdentityArray: IdentityData[] = [];
const duplicateIdentitySubject = new Subject<IdentityData[]>();


const validateIdentityData = (id: number, identityType: number, identityNumber: string) => {
    const interactedContacts = store.getState().interactedContacts.interactedContacts;
        var oldContact = interactedContacts.find(contact=> contact.id ===id);
        if (oldContact && oldContact.identificationType?.id && oldContact.identificationNumber && oldContact.identificationNumber!=""){
            var oldDuplicate = interactedContacts.filter(contact => {
                return id !== contact.id && (oldContact?.identificationType?.id === contact.identificationType?.id || 
                     (oldContact?.identificationType as any) === (contact.identificationType as any))&& oldContact?.identificationNumber === contact.identificationNumber;
            });
            if (oldDuplicate.length>0) {
                const index = duplicateIdentityArray.findIndex(obj => obj.identityType === oldContact?.identificationType?.id && obj.identityNumber === oldContact?.identificationNumber);
                if (index > -1) {
                    duplicateIdentityArray.splice(index, 1);
                    duplicateIdentitySubject.next(duplicateIdentityArray);
                }
            }

        }

        if (identityNumber !== "") {
        var duplicate = interactedContacts.filter(contact => {
            return id !== contact.id && (identityType === contact.identificationType?.id ||identityType === (contact.identificationType as any)) && identityNumber === contact.identificationNumber;
        });
       const index = duplicateIdentityArray.findIndex(obj => obj.identityType === identityType && obj.identityNumber === identityNumber);
        if (duplicate.length === 0) {   
                if (index > -1) {
                    duplicateIdentityArray.splice(index, 1);
                    duplicateIdentitySubject.next(duplicateIdentityArray);
                }
           
            return true;
        }
        else {
            if (index === -1) {
                duplicateIdentityArray.push(new IdentityData(identityType, identityNumber));
                duplicateIdentitySubject.next(duplicateIdentityArray);
            }
            
            return false;
        }
    }
    else return true;
}

const initContactDuplicateIdentityValidation = (contact : GroupedInteractedContact) =>{
    if (contact.identificationType?.id && contact.identificationNumber && contact.identificationNumber!==""){
        const interactedContacts = store.getState().interactedContacts.interactedContacts;
        const duplicates =  interactedContacts.filter(obj=> obj.id!==contact.id && (obj.identificationType?.id===contact.identificationType?.id || (obj.identificationType as any)=== (contact.identificationType as any))&& obj.identificationNumber===contact.identificationNumber)
        if (duplicates.length>0){
            duplicateIdentityArray.push(new IdentityData(contact.identificationType.id,contact.identificationNumber));
            duplicateIdentitySubject.next(duplicateIdentityArray);
            return false;
        }
        else return true;
    }
    return true;
}


export const contactQuestioningService = {
    validateIdentity: (id: number, identityType: number, identitynumber: string) => validateIdentityData(id, identityType, identitynumber),
    resetIdentityValidation: () => {
        duplicateIdentityArray = [];
        duplicateIdentitySubject.next([]);
    },
    getDuplicateIdentities: () => duplicateIdentitySubject.asObservable(),
    initContactDuplicateIdentityValidation:(contact:GroupedInteractedContact)=>{return initContactDuplicateIdentityValidation(contact)}
};


class IdentityData {
    identityType: number;
    identityNumber: string;

    constructor(identityType: number, identityNumber: string) {
        this.identityType = identityType;
        this.identityNumber = identityNumber;
    }
}

