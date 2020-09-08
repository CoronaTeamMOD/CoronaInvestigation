import {GoogleApiPlace} from "../commons/LocationInputField/LocationInput";

export interface Address {
    address: GoogleApiPlace | string | null;
    entrance?: string;
    floor?: string;
    apartment?: string;
}

export const initAddress : Address = {
    address:null,
    entrance: '',
    floor: '',
    apartment: ''
}

export default Address;
