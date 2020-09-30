import City from './City';
import Person from './Person';
import ContactType from './enums/ContactType';
import Occupations from './enums/Occupations';

interface InteractedContact extends Person {
    id: number;
    contactDate: Date;
    contactType: ContactType;
    extraInfo: string;
    birthDate: Date;
    cantReachContact: boolean;
    relationship: string;
    familyRelationship: string;
    occupation: Occupations;
    doesHaveBackgroundDiseases: boolean;
    contactedPersonCity: City;
    doesFeelGood: boolean;
    doesNeedHelpInIsolation: boolean;
    repeatingOccuranceWithConfirmed: boolean;
    doesLiveWithConfirmed: boolean;
    doesWorkWithCrowd: boolean;
};

export default InteractedContact;
