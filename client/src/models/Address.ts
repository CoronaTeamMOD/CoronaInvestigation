import {GoogleApiPlace} from "../commons/LocationInputField/LocationInput";

export type Address = GoogleApiPlace | null;

export interface DBAddress {
    city: string;
    street: string;
    floor: string;
    houseNum: string;
}

export const initAddress: Address  = null;

export default Address;
