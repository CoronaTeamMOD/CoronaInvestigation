import { PersonalInfoTabState } from 'components/App/Content/InvestigationForm/TabManagement/PersonalInfoTab/PersonalInfoTabInterfaces';
import { PersonalInfoDbData } from '../../models/Contexts/PersonalInfoContextData';
import * as Actions from './personalInfoActionTypes';

export interface PersonalInfoState {
    pending: boolean;
    personalInfo: PersonalInfoDbData;
    error: any;
}

const initialState: PersonalInfoTabState = {
    phoneNumber: '',
    additionalPhoneNumber: '',
    contactPhoneNumber: '',
    contactInfo: '',
    insuranceCompany: '',
    address: {
        city: '',
        street: '',
        houseNum: '',
        apartment: ''
    },
    relevantOccupation: '',
    educationOccupationCity: '',
    institutionName: '',
    otherOccupationExtraInfo: '',
    role: undefined,
    educationGrade: undefined,
    educationClassNumber: undefined,
    personalInfoWasChanged: false
};

type ValueOf<T> = T[keyof T];

const personalInfoReducer = (state = initialState, action: Actions.PersonalInfoAction): PersonalInfoTabState => {
    switch (action.type) {
        case Actions.GET_PERSONAL_INFO:
            return action.payload.personalInfo;
        case Actions.GET_PERSONAL_INFO_ERROR:
            return action.error;
        case Actions.SET_PERSONAL_INFO:
            let newState = state;
            (newState[action.payload.propertyName] as ValueOf<PersonalInfoTabState>) = action.payload.value;
            newState.personalInfoWasChanged = true;
            return newState;
        case Actions.RESET_PERSONAL_INFO:
            return initialState;
        case Actions.SET_PERSONAL_INFO_WAS_CHANGED:
            return {...state, personalInfoWasChanged: action.payload.value};
        default: return state;
    }
}

export default personalInfoReducer;