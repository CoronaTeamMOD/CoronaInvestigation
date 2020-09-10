import {createContext} from 'react';

import Gender from 'models/enums/Gender';
import identificationType from 'models/enums/IdentificationTypes';
import relevantOccupations from 'models/enums/relevantOccupations';
import {personalInfoContextData} from 'models/Contexts/personalInfoContextData'

export const initialPersonalInfo: personalInfoContextData = {
    phoneNumber: '',
    isInvestigatedPersonsNumber: true,
    selectReasonNumberIsNotRelated: '',
    writeReasonNumberIsNotRelated: '',
    additionalPhoneNumber: '',
    gender: Gender.MALE,
    identificationType: identificationType.ID,
    identificationNumber: '',
    age: '',
    motherName: '',
    fatherName: '',
    insuranceCompany: '',
    HMO: '',
    address: {
        address: null,
        entrance: '',
        floor: '3',
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