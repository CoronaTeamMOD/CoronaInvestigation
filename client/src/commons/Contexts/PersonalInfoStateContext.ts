import {createContext} from 'react';

import Gender from 'models/enums/Gender';
import identificationType from 'models/enums/IdentificationTypes';
import RelevantOccupations from 'models/enums/RelevantOccupations';
import {personalInfoContextData} from 'models/Contexts/personalInfoContextData'

const initialPersonalInfo: personalInfoContextData = {
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
        city: '',
        neighbourhood: '',
        street: '',
        houseNumber: -1,
        entrance: '',
        floor: -1,
        apartment: -1
    },
    relevantOccupation: RelevantOccupations.MOH_Worker,
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