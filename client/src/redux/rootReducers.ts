import { withReduxStateSync } from 'redux-state-sync';
import {combineReducers, Reducer, CombinedState, AnyAction} from 'redux';

import cityReducer from './City/cityReducer';
import userReducer from './User/userReducer';
import StoreStateType from './storeStateType';
import genderReducer from './Gender/GenderReducer';
import countryReducer from './Country/countryReducer';
import isLoadingReducer from './IsLoading/isLoadingReducer';
import investigationReducer from './Investigation/investigationReducer';

export default withReduxStateSync(combineReducers<StoreStateType>({
     user: userReducer,
     isLoading: isLoadingReducer,
     investigation: investigationReducer,
     gender: genderReducer,
     cities: cityReducer,
     countries: countryReducer
})) as unknown as Reducer<CombinedState<StoreStateType>, AnyAction>;
