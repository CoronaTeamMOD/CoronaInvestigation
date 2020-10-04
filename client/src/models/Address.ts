import {GeocodeResponse} from "../commons/LocationInputField/LocationInput";

export type Address = GeocodeResponse | null;

export interface DBAddress {
    city: string | null;
    street: string | null;
    floor: string | null;
    houseNum: string | null;
}

export const initDBAddress: DBAddress  = {
    city: '',
    street: '',
    floor: '',
    houseNum: '',
};

export const initAddress: Address  = null;

export default Address;
