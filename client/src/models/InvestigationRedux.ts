import InvestigatedPatient from './InvestigatedPatient';
import { InvestigationStatus } from './InvestigationStatus';
import SymptomsExistenceInfo from './SymptomsExistenceInfo';
import TrackingReccomendation from './TrackingReccomendation';

interface InvestigationRedux extends SymptomsExistenceInfo {
    epidemiologyNumber: number;
    complexReasonsId: (number|null)[];
    investigationStatus: InvestigationStatus;
    investigatedPatient: InvestigatedPatient;
    creator: string;
    lastUpdator: string;
    lastOpenedEpidemiologyNumber: number;
    isCurrentlyLoading: boolean;
    axiosInterceptorId: number;
    datesToInvestigate: Date[];
    validationDate: Date;
    endTime: Date | null;
    trackingReccomendation: TrackingReccomendation;
}

export default InvestigationRedux;
