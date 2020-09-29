import { Person } from './Person';
import ContactType from './enums/ContactType';

interface InteractedContact extends Person {
    id: number;
    contactDate: Date;
    contactType: ContactType;
    extraInfo: string;
    birthDate: Date;
    cantReachContact: boolean;
    relationship: string;
}

export default InteractedContact;
