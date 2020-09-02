import {createContext, useContext} from 'react';

import Gender from 'models/enums/Gender';
import identificationType from 'models/enums/IdentificationTypes';
import RelevantOccupations from 'models/enums/RelevantOccupations';
import {personalInfoContextData} from 'models/Contexts/personalInfoContextData'

const initialPersonalInfoContext: personalInfoContextData = {
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
        neighborhood: '',
        street: '',
        houseNumber: -1,
        entrance: '',
        floor: -1
    },
    relevantOccupation: RelevantOccupations.MOH_Worker,
    institutionName: ''
} 

interface EmptyContext {
    phoneNumber: undefined;
    isInvestigatedPersonsNumber: undefined;
    selectReasonNumberIsNotRelated: undefined;
    writeReasonNumberIsNotRelated: undefined;
    additionalPhoneNumber: undefined;
    gender: undefined;
    identificationType: undefined;
    identificationNumber: undefined;
    age: undefined;
    motherName: undefined;
    fatherName: undefined;
    insuranceCompany: undefined;
    HMO: undefined;
    adress: {
        city: undefined;
        neighborhood: undefined;
        street: undefined;
        houseNumber: undefined;
        entrance: undefined;
        floor: undefined;
    };
    relevantOccupation: undefined;
    institutionName: undefined;
} 

export const personalInfoContext = createContext<personalInfoContextData>(initialPersonalInfoContext);
export const PersonalInfoContextConsumer = personalInfoContext.Consumer;
export const PersonalInfoContextProvider = personalInfoContext.Provider;