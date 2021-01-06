import InvestigatedPatient from './InvestigatedPatient';
import { InvestigationStatus } from './InvestigationStatus';
import SymptomsExistenceInfo from './SymptomsExistenceInfo';

interface InvestigationRedux extends SymptomsExistenceInfo {
    epidemiologyNumber: number;
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
}

export default InvestigationRedux;
