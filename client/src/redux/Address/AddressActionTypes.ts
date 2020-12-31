import FlattenedDBAddress from 'models/DBAddress';

export const SET_ADDRESS = 'SET_ADDRESS';

interface SetAddress {
    type: typeof SET_ADDRESS,
    payload: { address: FlattenedDBAddress }
}

export type AddressAction = SetAddress;
