import { Person } from './Person';

interface Contact {
    personalInfo: Person,
    needsToBeQuarantined: boolean;
    contactEvent: number;
    extraInfo?: string;
}

export default Contact;