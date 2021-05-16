interface FlattenedDBAddress {
    city: string;
    street: string;
    houseNum: string;
    apartment?: string;
    floor? : string;
};

type AddressComponent = {id: string; displayName: string};

export interface DBAddress {
    city: AddressComponent;
    street: AddressComponent;
    floor: string;
    houseNum: string;
    apartment: string;
};

export const initDBAddress: FlattenedDBAddress  = {
    city: '',
    street: '',
    apartment: '',
    houseNum: '',
};

export default FlattenedDBAddress;