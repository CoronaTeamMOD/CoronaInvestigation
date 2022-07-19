import CovidPatientDBOutput from './CovidPatientDBOutput';

export  interface ExposureByInvestigationId {
    data: {
        allExposures: {
            nodes: DBExposure[]
        }
    }
}


export interface DBExposure {
    id?: number,
    investigationId: number,
    exposureDate?: Date,
    wasAbroad?: boolean,
    wasConfirmedExposure?: boolean,
    wasInEvent?: boolean,
    wasInVaction?:boolean,
    borderCheckpointType?: number,
    arrivalDateToIsrael?: Date,
    arrivalTimeToIsrael?: string,
    lastDestinationCountry?: string,
    wereConfirmedExposuresDesc?:string,
    borderCheckpointByBorderCheckpoint?: any,
    flightsByExposureId:{
        nodes: FlightDB[]
    }
    exposureDetailsByExposureId:{
        nodes: ExposureDetailsDB[]
    }
};

export interface FlightDB {
    id?: number,
    flightOriginCountry?: any,
    flightDestinationCountry?: any,
    flightDestinationAirport?: string,
    flightOriginAirport?: string,
    airline?: any,
    flightNum?: string,
    otherFlightNum?: string,
    flightStartDate?: Date,
    flightEndDate?: Date,
    otherAirline?: string,
    flightSeatNum?: string,
    countryByFlightOriginCountry?: any,
    countryByFlightDestinationCountry?: any,
    airlineByAirlineId?: any,
    actionFlag?: string,
}

export  interface ExposureDetailsDB {
    id?: number,
    exposureAddress?: string,
    exposurePlaceSubType?: number,
    exposurePlaceType?: string,   
    isExposurePersonKnown: boolean | undefined,
    covidPatientByExposureSource: CovidPatientDBOutput | null,
}

// interface DBExposure {
//     id?: number,
//     investigationId: number,
//     covidPatientByExposureSource: CovidPatientDBOutput | null,
//     exposureDate?: Date,
//     exposureAddress?: string,
//     exposurePlaceSubType?: number,
//     exposurePlaceType?: string,
//     flightDestinationCity?: string,
//     flightDestinationAirport?: string,
//     flightOriginCity?: string,
//     flightOriginAirport?: string,
//     flightStartDate?: Date,
//     flightEndDate?: Date,
//     airline?: string,
//     flightNum?: string,
//     flightOriginCountry?: string,
//     flightDestinationCountry?: string,
//     wasAbroad?: boolean,
//     wasConfirmedExposure: boolean,
//     isExposurePersonKnown: boolean | undefined,
//     borderCheckpoint?: any,
//     borderCheckpointType?: number,
//     arrivalDateToIsrael?: Date,
//     arrivalTimeToIsrael?: string,
//     flightSeatNum?: string,
//     otherFlightNum?: string,
//     lastDestinationCountry?: string,
//     borderCheckpointByBorderCheckpoint?: any,
//     otherAirline?: string,
// };