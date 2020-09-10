import {DBAddress} from '../Address';
import Gender from '../enums/Gender';
import identificationType from '../enums/IdentificationTypes';
import relevantOccupations from '../enums/relevantOccupations';

export interface personalInfoContextData {
    phoneNumber: string;
    additionalPhoneNumber: string;
    contactPhoneNumber: string;
    insuranceCompany: string,
    address: DBAddress;
    relevantOccupation: string;
    educationOccupationCity: string;
    institutionName: string;
    otherOccupationExtraInfo: string;
}