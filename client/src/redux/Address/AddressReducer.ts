import FlattenedDBAddress from 'models/DBAddress';

import * as Actions from './AddressActionTypes';

const initialState: FlattenedDBAddress = { city: '', apartment: '', houseNum: '', street: '' };

const addressReducer = (state = initialState, action: Actions.AddressAction): FlattenedDBAddress => {
    switch (action.type) {
        case Actions.SET_ADDRESS: return action.payload.address

        default: return state;
    }
}

export default addressReducer;
