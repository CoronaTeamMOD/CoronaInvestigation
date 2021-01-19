import ContactedPerson from './ContactedPerson';

type ContactEvent = {
    contactedPeopleByContactEvent : {
        nodes: {
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