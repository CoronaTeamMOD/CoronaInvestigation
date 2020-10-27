import InvestigatedPatient from './InvestigatedPatient';
import { InvestigationStatus } from './InvestigationStatus';

interface InvestigationRedux {
    epidemiologyNumber: number;
    investigationStatus: InvestigationStatus;
    investigatedPatient: InvestigatedPatient;
    creator: string;
    lastUpdator: string;
    lastOpenedEpidemiologyNumber: number;
    isCurrentlyLoading: boolean;
    axiosInterceptorId: number;
    validationDate: Date;
}

export default InvestigationRedux;
