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
    age: string,
    motherName: string,
    fatherName: string,
    insuranceCompany: string,
    HMO: string,
    address: Address;
    relevantOccupation: RelevantOccupations;
    institutionName: string;
}