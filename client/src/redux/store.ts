import thunk from 'redux-thunk';
import {createStore, applyMiddleware, compose} from 'redux';
import { createStateSyncMiddleware, initStateWithPrevTab } from 'redux-state-sync';

import reducers from './rootReducers';
import * as userActionTypes from '../redux/User/userActionTypes';
import * as investigationActionTypes from '../redux/Investigation/investigationActionTypes';
import * as isInInvestigationActionTypes from '../redux/IsInInvestigations/isInInvestigationActionTypes';

const config = {
    predicate: (action: any) => (action.type === investigationActionTypes.SET_LAST_OPENED_EPIDEMIOLOGY_NUM || 
        action.type === investigationActionTypes.SET_IS_CURRENTLY_LOADING || 
        action.type === isInInvestigationActionTypes.SET_IS_IN_INVESTIGATION ||
        action.type === userActionTypes.SET_IS_ACTIVE),
};
const middlewares = [createStateSyncMiddleware(config)];

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk, ...middlewares)));
initStateWithPrevTab(store);