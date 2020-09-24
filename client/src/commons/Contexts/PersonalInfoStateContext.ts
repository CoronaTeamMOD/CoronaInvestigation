import {createContext} from 'react';

import { initialPhoneNumberControl } from 'models/PhoneNumberControl';
import {personalInfoContextData} from 'models/Contexts/personalInfoContextData';

import { initialAddress } from './ClinicalDetailsContext';

export const initialPersonalInfo: personalInfoContextData = {
    phoneNumber: '',
    additionalPhoneNumber: '',
    contactPhoneNumber: '',
    insuranceCompany: '',
    address: initialAddress,
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
    personalInfoData: personalInfoContextData,
    setPersonalInfoData: React.Dispatch<React.SetStateAction<personalInfoContextData>>
}

export const personalInfoContext = createContext<PersonalInfoDataAndSet>(initialPersonalInfoContext);
export const PersonalInfoContextProvider = personalInfoContext.Provider;
