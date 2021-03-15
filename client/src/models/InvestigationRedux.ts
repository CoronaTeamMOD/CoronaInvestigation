import InvestigatedPatient from './InvestigatedPatient';
import { InvestigationStatus } from './InvestigationStatus';
import SymptomsExistenceInfo from './SymptomsExistenceInfo';
import TrackingRecommendation from './TrackingRecommendation';

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
    trackingRecommendation: TrackingRecommendation;
}

export default InvestigationRedux;
