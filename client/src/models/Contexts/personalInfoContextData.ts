import {DBAddress} from '../Address';

export interface personalInfoDbData {
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

export interface personalInfoFormData {
    phoneNumber: string;
    additionalPhoneNumber: string;
    contactPhoneNumber: string;
    contactInfo: string;
    insuranceCompany: string,
    city: string,
    street: string,
    floor: string,
    houseNum: string,
    relevantOccupation: string;
    educationOccupationCity: string;
    institutionName: string;
    otherOccupationExtraInfo: string;
}

