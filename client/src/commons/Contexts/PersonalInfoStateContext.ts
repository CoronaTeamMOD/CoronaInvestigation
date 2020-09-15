import {createContext} from 'react';

import {personalInfoContextData} from 'models/Contexts/personalInfoContextData';
import { initialPhoneNumberControl } from 'models/PhoneNumberControl';

import { initialAddress } from './ClinicalDetailsContext';

export const initialPersonalInfo: personalInfoContextData = {
    phoneNumber: initialPhoneNumberControl,
    additionalPhoneNumber: initialPhoneNumberControl,
    contactPhoneNumber: initialPhoneNumberControl,
    insuranceCompany: '',
    address: initialAddress,
    relevantOccupation: '',
    educationOccupationCity: '',
    institutionName: '',
    otherOccupationExtraInfo: ''
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