import { GoogleApiPlace } from '../commons/LocationInputField/LocationInput';

interface ExposureData {
    exposureId: number | null,
    wasConfirmedExposure: boolean,
    exposureFirstName: string;
    exposureLastName: string;
    exposureDate: Date | undefined;
    exposureAddress: GoogleApiPlace | null; 
    exposurePlaceType: string;
    exposurePlaceSubType: number
}

export default ExposureData;