import {createContext} from 'react';

import Gender from 'models/enums/Gender';
import identificationType from 'models/enums/IdentificationTypes';
import relevantOccupations from 'models/enums/relevantOccupations';
import {personalInfoContextData} from 'models/Contexts/personalInfoContextData'

const initialPersonalInfo: personalInfoContextData = {
    phoneNumber: '',
    additionalPhoneNumber: '',
    contactPhoneNumber: '',
    insuranceCompany: '',
    address: {
        city: '',
        neighborhood: '',
        street: '',
        houseNumber: '',
        entrance: '',
        floor: '',
        apartment: ''
    },
    relevantOccupation: relevantOccupations.MOH_Worker,
    institutionName: ''
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