import DBAddress from './DBAddress';
import {GeocodeResponse} from '../commons/LocationInputField/LocationInput';

export type Address = GeocodeResponse | null;

export const initDBAddress: DBAddress  = {
    city: '',
    street: '',
    floor: '',
    houseNum: '',
};

export const initAddress: Address  = null;

export default Address;
