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
} 
