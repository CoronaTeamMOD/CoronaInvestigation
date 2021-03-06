import { initDBAddress } from 'models/DBAddress';
import { PersonalInfoFormData } from 'models/Contexts/PersonalInfoContextData';

export const initialPersonalInfo: PersonalInfoFormData = {
    phoneNumber: '',
    additionalPhoneNumber: '',
    contactPhoneNumber: '',
    insuranceCompany: '',
    ...initDBAddress,
    relevantOccupation: '',
    educationOccupationCity: '',
    institutionName: '',
    otherOccupationExtraInfo: '',
    contactInfo: '',
    role: -1,
    educationGrade: -1,
    educationClassNumber: -1,
};
