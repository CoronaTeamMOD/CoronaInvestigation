import {DBAddress} from '../Address';

export interface personalInfoContextData {
    phoneNumber: string;
    additionalPhoneNumber: string;
    contactPhoneNumber: string;
    contactInfo: string;
    insuranceCompany: string,
    address: DBAddress;
    relevantOccupation: string;
    educationOccupationCity: string;
    institutionName: string;
    otherOccupationExtraInfo: string;
}
