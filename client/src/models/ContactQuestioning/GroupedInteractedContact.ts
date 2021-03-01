import InteractedContact from '../InteractedContact';

export interface GroupedInteractedContactEvent {
    date : Date,
    name : string,
    contactType : InteractedContact['contactType']
}

export default interface GroupedInteractedContact extends InteractedContact {
    contactEvents : GroupedInteractedContactEvent[];
}
