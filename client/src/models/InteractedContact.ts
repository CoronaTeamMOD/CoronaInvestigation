import Person from './Person';
import {DBAddress} from './DBAddress';
import ContactType from './enums/ContactType';
import Occupations from './enums/Occupations';

interface InteractedContact extends Person {
    personInfo?: number;
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
    doesHaveBackgroundDiseases: boolean | null;
    isolationAddress: DBAddress;
    doesFeelGood: boolean | null;
    doesNeedHelpInIsolation: boolean | null;
    repeatingOccuranceWithConfirmed: boolean | null;
    doesLiveWithConfirmed: boolean | null;
    doesWorkWithCrowd: boolean | null;
    doesNeedIsolation: boolean | null;
    creationTime?: Date;
    involvementReason: number | null;
    involvedContactId: number | null;
    placeName?: string;
    finalEpidemiologicalStatusDesc?: string;
    colorCode?: string;
    caseStatusDesc?: string;
    immuneDefinitionBasedOnSerologyStatusDesc?: string;
    vaccinationStatusDesc?: string;
    isolationReportStatusDesc?: string;
    isolationObligationStatusDesc?: string;
    };

export default InteractedContact;
