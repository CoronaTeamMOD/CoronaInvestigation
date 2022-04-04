import InvestigatedPatient from './InvestigatedPatient';
import { InvestigationStatus } from './InvestigationStatus';
import SymptomsExistenceInfo from './SymptomsExistenceInfo';
import TrackingRecommendation from './TrackingRecommendation/TrackingRecommendation';

interface InvestigationRedux extends SymptomsExistenceInfo {
    epidemiologyNumber: number;
    complexReasonsId: (number | null)[];
    investigationStatus: InvestigationStatus;
    investigatedPatient: InvestigatedPatient;
    creator: string;
    lastUpdator: string;
    lastOpenedEpidemiologyNumber: number;
    isCurrentlyLoading: boolean;
    axiosInterceptorId: number;
    datesToInvestigate: Date[];
    oldDatesToInvestigate: {minDate:Date | undefined,maxDate:Date | undefined};
    validationDate: Date;
    endTime: Date | null;
    trackingRecommendation: TrackingRecommendation;
    comment: string | null;
    isViewMode: boolean;
    contactInvestigationVerifiedAbroad: boolean;
    investigationStaticFieldChange: boolean;
    trackingRecommendationChanged: boolean; 
    investigationInfoChanged: boolean;
}

export default InvestigationRedux;
