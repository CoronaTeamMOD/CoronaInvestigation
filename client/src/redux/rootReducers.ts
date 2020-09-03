import {combineReducers} from 'redux';
import userReducer from './User/userReducer';
import StoreStateType from './storeStateType';
import isLoadingReducer from './IsLoading/isLoadingReducer';

export default combineReducers<StoreStateType>({
     user: userReducer,
     isLoading: isLoadingReducer

})