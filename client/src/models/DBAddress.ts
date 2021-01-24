interface FlattenedDBAddress {
    city: string;
    street: string;
    floor: string;
    houseNum: string;
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
};

export default FlattenedDBAddress;
