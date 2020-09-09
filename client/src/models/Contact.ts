import {Person} from "./Person";

interface Contact {
    id: string;
    needsToBeQuarantined?: boolean;
    moreDetails?: string;
    personalInfo: Person;
}

export default Contact;