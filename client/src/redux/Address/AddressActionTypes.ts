import DBAddress from 'models/DBAddress';

export const SET_ADDRESS = 'SET_ADDRESS';

interface SetAddress {
    type: typeof SET_ADDRESS,
    payload: { address: DBAddress }
}

export type AddressAction = SetAddress;
