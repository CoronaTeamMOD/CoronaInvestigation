import PlaceType from './PlaceType';
import {GoogleApiPlace} from '../commons/LocationInputField/LocationInput';

interface ExposureData {
    placeType: PlaceType;
    exposureLocation: GoogleApiPlace | null;
    exposingPersonName: string;
}

export default ExposureData;