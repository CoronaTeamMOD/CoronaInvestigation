import { InvestigationStatus } from './InvestigationStatus';

interface InvestigationRedux {
    epidemiologyNumber: number;
    investigationStatus: InvestigationStatus;
    investigatedPatientId: number;
    creator: string;
    lastUpdator: string;
    lastOpenedEpidemiologyNumber: number;
    isCurrentlyLoading: boolean;
    axiosInterceptorId: number;
}

export default InvestigationRedux;
