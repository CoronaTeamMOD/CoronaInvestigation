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
    age: -1,
    motherName: '',
    fatherName: '',
    insuranceCompany: '',
    HMO: '',
    adress: {
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

export const personalInfoContext = createContext<personalInfoContextData>(initialPersonalInfoContext);

export const personalInfoContextConsumer = personalInfoContext.Consumer;
export const personalInfoContextProvider = personalInfoContext.Provider;