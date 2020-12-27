import { combineReducers, Reducer, CombinedState, AnyAction } from 'redux';

import formReducer from './Form/formReducer';
import cityReducer from './City/cityReducer';
import userReducer from './User/userReducer';
import StoreStateType from './storeStateType';
import genderReducer from './Gender/GenderReducer';
import countryReducer from './Country/countryReducer';
import addressReducer from './Address/AddressReducer';
import statusesReducer from './Status/statusesReducer';
import isLoadingReducer from './IsLoading/isLoadingReducer';
import contactTypeReducer from './ContactType/contactTypeReducer';
import subStatusesReducer from './SubStatuses/subStatusesReducer';
import occupationsReducer from './Occupations/occupationsReducer';
import investigationReducer from './Investigation/investigationReducer';
import isInInvestigationReducer from './IsInInvestigations/isInInvestigationReducer';
import educationGradeReducer from './EducationGrade/educationGradeReducer';

export default combineReducers<StoreStateType>({
     occupations: occupationsReducer,
     user: userReducer,
     isLoading: isLoadingReducer,
     isInInvestigation: isInInvestigationReducer,
     investigation: investigationReducer,
     gender: genderReducer,
     cities: cityReducer,
     countries: countryReducer,
     contactTypes: contactTypeReducer,
     statuses: statusesReducer,
     subStatuses: subStatusesReducer,
     formsValidations: formReducer,
     address: addressReducer,
     educationGrades: educationGradeReducer,
}) as unknown as Reducer<CombinedState<StoreStateType>, AnyAction>;
