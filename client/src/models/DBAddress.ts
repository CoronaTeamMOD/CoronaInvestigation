interface FlattenedDBAddress {
    city: string;
    street: string;
    floor: string;
    houseNum: string;
    streetName?: string;
    addressId?: number | null;
}

type AddressComponent = {id: string; displayName: string}

export interface DBAddress {
    city: AddressComponent;
    street: AddressComponent;
    floor: string;
    houseNum: string;
    apartment: string;
}

export const initDBAddress: FlattenedDBAddress  = {
    city: '',
    street: '',
    floor: '',
    houseNum: '',
    addressId: null
};

export default FlattenedDBAddress;
