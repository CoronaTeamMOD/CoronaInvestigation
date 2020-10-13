import CovidPatient from './CovidPatient';

interface Exposure {
    id?: number,
    investigationId: number,
    exposureSource: CovidPatient | null,
    exposureDate?: Date,
    exposureAddress?: string,
    exposurePlaceSubType?: number,
    exposurePlaceType?: string,
    flightDestinationCity?: string,
    flightDestinationAirport?: string,
    flightOriginCity?: string,
    flightOriginAirport?: string,
    flightStartDate?: Date,
    flightEndDate?: Date,
    airline?: string,
    flightNum?: string,
    flightOriginCountry?: string,
    flightDestinationCountry?: string,
    wasAbroad?: boolean,
    wasConfirmedExposure: boolean
};

export default Exposure;
