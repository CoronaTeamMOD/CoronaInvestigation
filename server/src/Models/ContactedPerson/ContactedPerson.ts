import City from '../Address/City';
import Person from '../Person/Person';
import ContactType from '../ContactEvent/Enums/ContactType';

interface InteractedContact extends Person {
    id: number;
    contactDate: Date;
    contactType: ContactType;
    extraInfo: string;
    birthDate: Date;
    cantReachContact: boolean;
    relationship: string;
    familyRelationship: number;
    occupation: string;
    doesHaveBackgroundDiseases: boolean;
    contactedPersonCity: City;
    doesFeelGood: boolean;
    doesNeedHelpInIsolation: boolean;
    repeatingOccuranceWithConfirmed: boolean;
    doesLiveWithConfirmed: boolean;
    doesWorkWithCrowd: boolean;
};

export default InteractedContact;
