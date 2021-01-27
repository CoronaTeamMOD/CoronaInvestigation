import ContactedPerson from './ContactedPerson';

type ContactNode = {
    id: number;
    involvedContactByInvolvedContactId?: {
        involvementReason: number; 
    }
    addressByIsolationAddress: {
        cityByCity: {
            displayName: string;
        }
    },
    personByPersonInfo: ContactedPerson
}

export default ContactNode;