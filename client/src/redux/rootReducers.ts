import { combineReducers, Reducer, CombinedState, AnyAction } from 'redux';

import formReducer from './Form/formReducer';
import cityReducer from './City/cityReducer';
import userReducer from './User/userReducer';
import StoreStateType from './storeStateType';
import genderReducer from './Gender/GenderReducer';
import countryReducer from './Country/countryReducer';
import addressReducer from './Address/AddressReducer';
import isLoadingReducer from './IsLoading/isLoadingReducer';
import statusesReducer from './Status/statusesReducer';
import contactTypeReducer from './ContactType/contactTypeReducer';
import subStatusesReducer from './SubStatuses/subStatusesReducer';
import investigationReducer from './Investigation/investigationReducer';
import isInInvestigationReducer from './IsInInvestigations/isInInvestigationReducer';

export default combineReducers<StoreStateType>({
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
}) as unknown as Reducer<CombinedState<StoreStateType>, AnyAction>;
