import { Person } from '../Person/Person';

export interface ContactedPerson {
    id: number;
    personByPersonInfo: Person;
    contactDate: Date;
    contactType: string;
    extraInfo: string;
    doesNeedIsolation: boolean,
    relationship: string;
    familyRelationship: number,
    doesHaveBackgroundDiseases: boolean;
    occupation: {
        id: number,
        displayName: string,
    };

    cantReachContact: boolean;
    contactedPersonCity: {
        id: number,
        displayName: string,
    };
    doesFeelGood: boolean;
    doesNeedHelpInIsolation: boolean;
    repeatingOccuranceWithConfirmed: boolean;
    doesLiveWithConfirmed: boolean;
}