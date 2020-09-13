import { GoogleApiPlace } from '../commons/LocationInputField/LocationInput';

interface ExposureData {
    id: number | null,
    wasConfirmedExposure: boolean,
    exposureFirstName: string;
    exposureLastName: string;
    exposureDate: Date | undefined;
    exposureAddress: GoogleApiPlace | null; 
    exposurePlaceType: string | null;
    exposurePlaceSubType: number | null
}

export default ExposureData;