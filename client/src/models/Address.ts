import {GoogleApiPlace} from "../commons/LocationInputField/LocationInput";

export interface Address {
    address: GoogleApiPlace | null;
    entrance?: string;
    floor?: string;
    apartment?: string;
    description?: string;
}

export interface DBAddress {
    city: string;
    street: string;
    floor: string;
    houseNum: string;
}

export const initAddress : Address = {
    address:null,
    entrance: '',
    floor: '',
    apartment: ''
}

export default Address;
