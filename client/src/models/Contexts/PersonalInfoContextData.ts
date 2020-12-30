import EducationGrade from 'models/EducationGrade';

import FlattenedDBAddress from '../DBAddress';
export interface PersonalInfoDbData {
    phoneNumber: string | null;
    additionalPhoneNumber: string | null;
    contactPhoneNumber: string | null;
    contactInfo: string | null;
    insuranceCompany: string | null;
    address: FlattenedDBAddress;
    relevantOccupation: string | null;
    educationOccupationCity: string | null;
    institutionName: string | null;
    otherOccupationExtraInfo: string | null;
    role: number | null;
    educationGrade: number | null;
    educationClassNumber: number | null;
};

export interface PersonalInfoFormData {
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
    role: number;
    educationGrade: number;
    educationClassNumber: number;
};
