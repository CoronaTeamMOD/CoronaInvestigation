import { Exposure } from 'commons/Contexts/ExposuresAndFlights';

export interface FormData {
    exposures : Exposure[]
    wereFlights : boolean;
    wereConfirmedExposures : boolean;
    wasInVacation: boolean | undefined,
    wasInEvent: boolean | undefined
}
