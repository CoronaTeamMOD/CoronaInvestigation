import thunk from 'redux-thunk';
import {createStore, applyMiddleware, compose} from 'redux';
import { createStateSyncMiddleware, initStateWithPrevTab } from 'redux-state-sync';

import reducers from './rootReducers';
import * as actionTypes from '../redux/Investigation/investigationActionTypes';

const config = {
    predicate: (action: any) => (action.type === actionTypes.SET_LAST_OPENED_EPIDEMIOLOGY_NUM || action.type === actionTypes.SET_IS_CURRENTLY_LOADING),
};
const middlewares = [createStateSyncMiddleware(config)];

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk, ...middlewares)));
initStateWithPrevTab(store);