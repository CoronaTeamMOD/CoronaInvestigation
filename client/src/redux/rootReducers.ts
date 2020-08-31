import {combineReducers} from 'redux';
import userReducer from './User/userReducer';
import StoreStateType from './storeStateType';

export default combineReducers<StoreStateType>({
     user: userReducer
})