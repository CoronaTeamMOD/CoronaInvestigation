import DBAddress from 'models/DBAddress';

export interface PersonalInfoDbData {
    phoneNumber: string | null;
    additionalPhoneNumber: string | null;
    contactPhoneNumber: string | null;
    contactInfo: string | null;
    insuranceCompany: string | null;
    address: DBAddress;
    relevantOccupation: string | null;
    educationOccupationCity: string | null;
    institutionName: string | null;
    otherOccupationExtraInfo: string | null;
}

export interface PersonalInfoFormData {
    phoneNumber: string;
    additionalPhoneNumber: string;
    contactPhoneNumber: string;
    contactInfo: string;
    insuranceCompany: string;
    city: string;
    street: string;
    floor: string;
    houseNum: string;
    relevantOccupation: string;
    educationOccupationCity: string;
    institutionName: string;
    otherOccupationExtraInfo: string;
}
