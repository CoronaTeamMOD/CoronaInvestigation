import {Address} from '../Address';
import Gender from '../enums/Gender';
import identificationType from '../enums/IdentificationTypes';
import RelevantOccupations from '../enums/RelevantOccupations';

export interface personalInfoContextData {
    phoneNumber: string;
    isInvestigatedPersonsNumber: boolean;
    selectReasonNumberIsNotRelated: string;
    writeReasonNumberIsNotRelated: string;
    additionalPhoneNumber: string;
    gender: Gender;
    identificationType: identificationType
    identificationNumber: string,
    age: number,
    motherName: string,
    fatherName: string,
    insuranceCompany: string,
    HMO: string,
    adress: Address;
    relevantOccupation: RelevantOccupations;
    institutionName: string;
}