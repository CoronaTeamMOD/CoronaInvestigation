import PlaceType from './PlaceType';
import {GoogleApiPlace} from '../commons/LocationInputField/LocationInput';

interface ExposureData {
    firstName: string;
    lastName: string;
    date: Date | undefined;
    address: GoogleApiPlace | null; // To be changed once google api is integrated
    placeType: PlaceType;
}

export default ExposureData;