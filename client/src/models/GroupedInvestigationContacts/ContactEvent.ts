import ContactedPerson from './ContactedPerson';

type ContactEvent = {
    contactedPeopleByContactEvent : {
        nodes: {
            id: number;
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