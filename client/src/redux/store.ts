import thunk from 'redux-thunk';
import {createStore, applyMiddleware, compose} from 'redux';

import reducers from './rootReducers';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)));