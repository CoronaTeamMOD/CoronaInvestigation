import Person from '../Person/Person';
import ContactType from '../ContactEvent/Enums/ContactType';

interface InteractedContact extends Person {
    id: number;
    contactDate: Date;
    contactEvent: number;
    contactType: ContactType;
    extraInfo: string;
    birthDate: Date;
    contactStatus: string | number;
    relationship: string;
    familyRelationship: number;
    occupation: string;
    doesHaveBackgroundDiseases: boolean;
    contactedPersonCity: string;
    doesFeelGood: boolean;
    doesNeedHelpInIsolation: boolean;
    repeatingOccuranceWithConfirmed: boolean;
    doesLiveWithConfirmed: boolean;
    doesWorkWithCrowd: boolean;
    creationTime: Date;
    creationSource: number;
    involvementReason: {
        involvementReason: number
    } | null,
    transitDate?: Date;
    isStayAnotherCountry: boolean | null;
    fromCountry?: number;
    overseasComments? : string;
};

export interface InteractedExcelContact extends InteractedContact {
    cityId? : number;
    streetId? : number;
    houseNum? : string;
    apartment? : string;
} 

export default InteractedContact;
