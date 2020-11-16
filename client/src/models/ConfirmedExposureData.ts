import CovidPatient from './CovidPatient';
import {GeocodeResponse, GoogleApiPlace} from '../commons/LocationInputField/LocationInput';

interface ConfirmedExposureData {
    id: number | null,
    wasConfirmedExposure: boolean,
    exposureDate: Date | null;
    exposureAddress: GoogleApiPlace | GeocodeResponse | null;
    exposurePlaceType: string | null;
    exposurePlaceSubType: number | null;
    exposureSource: CovidPatient | null;
}

export default ConfirmedExposureData;
