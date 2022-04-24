import { Exposure } from 'commons/Contexts/ExposuresAndFlights';
import BorderCheckpointData from 'models/BorderCheckpointData';

export interface FormData {
    exposures : Exposure[]
    wereFlights : boolean;
    wereConfirmedExposures : boolean;
    wereConfirmedExposuresDesc: string | null;
    wasInVacation: boolean | undefined;
    wasInEvent: boolean | undefined;
    borderCheckpointData: BorderCheckpointData | undefined;
}
