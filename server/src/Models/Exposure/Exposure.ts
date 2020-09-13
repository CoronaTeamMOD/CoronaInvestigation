interface ExposureDetails {
            id?: number,
            investigationId: number,
            exposureFirstName: string | null,
            exposureLastName: string | null,
            exposureDate: Date | null,
            exposureAddress: string | null,
            exposurePlaceSubType: number | null,
            exposurePlaceType: string | null,
            flightDestinationCity: string | null,
            flightDestinationAirport: string | null,
            flightOriginCity: string | null,
            flightOriginAirport: string | null,
            flightStartDate: Date | null,
            flightEndDate: Date | null,
            airline: string | null,
            flightNum: string | null,
            flightOriginCountry: string | null,
            flightDestinationCountry: string | null,
            wasAbroad: boolean | null,
            wasConfirmedExposure: boolean
};

export default ExposureDetails;
