import {combineReducers} from 'redux';

import formReducer from './Form/formReducer';
import cityReducer from './City/cityReducer';
import userReducer from './User/userReducer';
import StoreStateType from './storeStateType';
import genderReducer from './Gender/GenderReducer';
import countryReducer from './Country/countryReducer';
import isLoadingReducer from './IsLoading/isLoadingReducer';
import contactTypeReducer from './ContactType/contactTypeReducer';
import investigationReducer from './Investigation/investigationReducer';

export default combineReducers<StoreStateType>({
     user: userReducer,
     isLoading: isLoadingReducer,
     investigation: investigationReducer,
     gender: genderReducer,
     cities: cityReducer,
     countries: countryReducer,
     contactTypes: contactTypeReducer,
     formsValidations: formReducer
})
