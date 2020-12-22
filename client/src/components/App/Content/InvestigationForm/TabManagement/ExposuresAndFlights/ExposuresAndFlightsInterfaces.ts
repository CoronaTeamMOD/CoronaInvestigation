import { Exposure } from 'commons/Contexts/ExposuresAndFlights';

export interface FormData {
    wasInEilat : boolean;
    wasInDeadSea : boolean;
    exposures : Exposure[]
    wereFlights : boolean;
    wereConfirmedExposures : boolean;
}
