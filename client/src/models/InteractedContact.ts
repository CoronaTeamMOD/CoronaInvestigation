import { Person } from './Person';

interface InteractedContact extends Person {
    id: number;
    contactDate: Date;
    contactType: string;
    extraInfo: string;
    birthDate: Date;
    cantReachContact: boolean;
    relationship: string;
}

export default InteractedContact;
