import { withReduxStateSync } from 'redux-state-sync';
import {combineReducers, Reducer, CombinedState, AnyAction} from 'redux';

import formReducer from './Form/formReducer';
import cityReducer from './City/cityReducer';
import userReducer from './User/userReducer';
import StoreStateType from './storeStateType';
import genderReducer from './Gender/GenderReducer';
import countryReducer from './Country/countryReducer';
import isLoadingReducer from './IsLoading/isLoadingReducer';
import contactTypeReducer from './ContactType/contactTypeReducer';
import investigationReducer from './Investigation/investigationReducer';
import isInInvestigationReducer from './IsInInvestigations/isInInvestigationReducer';

export default withReduxStateSync(combineReducers<StoreStateType>({
     user: userReducer,
     isLoading: isLoadingReducer,
     isInInvestigation: isInInvestigationReducer,
     investigation: investigationReducer,
     gender: genderReducer,
     cities: cityReducer,
     countries: countryReducer,
     contactTypes: contactTypeReducer,
     formsValidations: formReducer
})) as unknown as Reducer<CombinedState<StoreStateType>, AnyAction>;
