import {GeocodeResponse, GoogleApiPlace} from '../commons/LocationInputField/LocationInput';
import CovidPatient from './CovidPatient';

interface ExposureData {
    id: number | null,
    wasConfirmedExposure: boolean,
    exposureDate: Date | null;
    exposureAddress: GoogleApiPlace | GeocodeResponse | null;
    exposurePlaceType: string | null;
    exposurePlaceSubType: number | null;
    exposureSource: CovidPatient | null;
    wasInEilat: boolean;
    wasInDeadSea: boolean;
}

export default ExposureData;
