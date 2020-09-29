import { Person } from './Person';
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
    occupation: Occupations;
    doesHaveBackgroundDiseases: boolean;
    contactedPersonCity: string;
    doesFeelGood: boolean;
    doesNeedHelpInIsolation: boolean;
    repeatingOccuranceWithConfirmed: boolean;
    doesLiveWithConfirmed: boolean;
}

export default InteractedContact;
