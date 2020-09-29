import {createContext} from 'react';

import {personalInfoFormData} from 'models/Contexts/personalInfoContextData';

export const initialPersonalInfo: personalInfoFormData = {
    phoneNumber: '',
    additionalPhoneNumber: '',
    contactPhoneNumber: '',
    insuranceCompany: '',
    city: "",
    street: "",
    floor: '',
    houseNum: '',
    relevantOccupation: '',
    educationOccupationCity: '',
    institutionName: '',
    otherOccupationExtraInfo: '',
    contactInfo: '',
} 

const initialPersonalInfoContext: PersonalInfoDataAndSet = {
    personalInfoData: initialPersonalInfo,
    setPersonalInfoData: () => {}
};

export interface PersonalInfoDataAndSet {
    personalInfoData: personalInfoFormData,
    setPersonalInfoData: React.Dispatch<React.SetStateAction<personalInfoFormData>>
}

export const personalInfoContext = createContext<PersonalInfoDataAndSet>(initialPersonalInfoContext);
export const PersonalInfoContextProvider = personalInfoContext.Provider;
