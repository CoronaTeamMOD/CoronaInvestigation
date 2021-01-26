import ContactedPerson from './ContactedPerson';

type ContactEvent = {
    contactedPeopleByContactEvent : {
        nodes: {
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
        }[]
    }
}

export default ContactEvent;