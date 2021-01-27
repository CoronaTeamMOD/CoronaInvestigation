import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import storageSession from 'redux-persist/lib/storage/session';
import { persistStore, persistReducer, PersistConfig } from 'redux-persist'

import reducers from './rootReducers';
import StoreStateType from './storeStateType';


const persistConfig: PersistConfig<StoreStateType> = {
    key: 'root',
    storage: storageSession,
    // We used the blacklist prop in order to avoid saving maps on session storage
    blacklist: ['cities', 'countries', 'contactTypes','authorities']
};

const persistedReducer = persistReducer(persistConfig, reducers)
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(thunk)));
export const persistor = persistStore(store);