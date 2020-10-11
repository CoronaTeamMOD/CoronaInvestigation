import {GeocodeResponse, GoogleApiPlace} from '../commons/LocationInputField/LocationInput';

interface ExposureData {
    id: number | null;
    wasConfirmedExposure: boolean;
    exposureFirstName: string | null;
    exposureLastName: string | null;
    exposureDate: Date | null;
    exposureAddress: GoogleApiPlace | GeocodeResponse | null;
    exposurePlaceType: string | null;
    exposurePlaceSubType: number | null
}

export default ExposureData;
