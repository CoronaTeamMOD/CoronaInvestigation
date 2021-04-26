import ContactedPerson from './ContactedPerson';

type ContactNode = {
    id: number;
    involvedContactByInvolvedContactId?: {
        involvementReason: number; 
    }
    personByPersonInfo: ContactedPerson
}

export default ContactNode;