import {combineReducers} from 'redux';

import userReducer from './User/userReducer';
import StoreStateType from './storeStateType';
import genderReducer from './Gender/GenderReducer';
import isLoadingReducer from './IsLoading/isLoadingReducer';
import investigationReducer from './Investigation/investigationReducer';

export default combineReducers<StoreStateType>({
     user: userReducer,
     isLoading: isLoadingReducer,
     investigation: investigationReducer,
     gender: genderReducer,
})
