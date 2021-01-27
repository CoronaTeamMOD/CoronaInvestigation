import ContactNode from './ContactNode';

type ContactEvent = {
    contactedPeopleByContactEvent : {
        nodes: ContactNode[]
    }
}

export default ContactEvent;