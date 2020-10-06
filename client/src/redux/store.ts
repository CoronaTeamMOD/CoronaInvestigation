import thunk from 'redux-thunk';
import {createStore, applyMiddleware, compose} from 'redux';

import reducers from './rootReducers';
import { createStateSyncMiddleware, initStateWithPrevTab } from 'redux-state-sync';

const config = {
    predicate: (action: any) => action.type === 'SET_LAST_OPENED_EPIDEMIOLOGY_NUM',
};
const middlewares = [createStateSyncMiddleware(config)];

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk, ...middlewares)));
initStateWithPrevTab(store);