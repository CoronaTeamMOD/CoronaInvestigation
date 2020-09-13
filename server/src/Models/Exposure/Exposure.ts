interface ExposureDetails {
            id?: number,
            investigationId: number,
            exposureFirstName?: string,
            exposureLastName?: string,
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

export default ExposureDetails;
