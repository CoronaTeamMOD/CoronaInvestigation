import { Person } from '../Person/Person';

export interface ContactedPerson {
    personalInfo: Person,
    needsToBeQuarantined: boolean;
    contactEvent: number;
    extraInfo?: string;
}