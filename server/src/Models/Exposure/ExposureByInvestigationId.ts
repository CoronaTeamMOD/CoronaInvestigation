import CovidPatientDBOutput from './CovidPatientDBOutput';

export default interface ExposureByInvestigationId {
    data: {
        allExposures: {
            nodes: DBExposure[]
        }
    }
}

interface DBExposure {
    id?: number,
    investigationId: number,
    covidPatientByExposureSource: CovidPatientDBOutput | null,
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
    wasConfirmedExposure: boolean,
    isExposurePersonKnown: boolean | undefined,
    borderCheckpoint?: any,
    borderCheckpointType?: number,
    arrivalDateToIsrael?: Date,
    arrivalTimeToIsrael?: string,
    flightSeatNum?: string,
    otherFlightNum?: string,
    lastDestinationCountry?: string,
    borderCheckpointByBorderCheckpoint?: any,
    otherAirline?: string,
};