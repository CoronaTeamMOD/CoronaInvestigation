import Person from './Person';
import ContactType from './enums/ContactType';
import Occupations from './enums/Occupations';

interface InteractedContact extends Person {
    id: number;
    contactDate: Date;
    contactEvent: number;
    contactType: ContactType;
    extraInfo: string;
    birthDate: Date;
    contactStatus: number | string;
    relationship: string;
    familyRelationship: number;
    occupation: Occupations;
    doesHaveBackgroundDiseases: boolean;
    contactedPersonCity: string;
    doesFeelGood: boolean;
    doesNeedHelpInIsolation: boolean;
    repeatingOccuranceWithConfirmed: boolean;
    doesLiveWithConfirmed: boolean;
    doesWorkWithCrowd: boolean;
    doesNeedIsolation: boolean;
    creationTime?: Date;
    involvementReason: number | null;
    involvedContactId: number | null;
};

export default InteractedContact;
