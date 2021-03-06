import StaticUser from './StaticUser';
import SymptomsExistenceInfo from './SymptomsExistenceInfo';
import InvestigatedPatientStaticInfo from './InvestigatedPatientStaticInfo';
import PersonStaticInfo from './PersonStaticInfo';

interface InvestigationInfo extends SymptomsExistenceInfo, InvestigatedPatientStaticInfo, PersonStaticInfo  {
    comment: string | null;
    startTime: Date;
    lastUpdateTime: Date;
    investigatingUnit: string;
    investigatedPatientId: number;
    userByCreator: StaticUser;
    userByLastUpdator: StaticUser;
    endTime: Date | null;
};

export interface InvestigationInfoData extends Omit<InvestigationInfo, 'validationDate' | 'symptomsStartDate'> {
    validationDate: string;
    symptomsStartDate: string;
    trackingSubReasonByTrackingSubReason: {
        reasonId: number | null;
        subReasonId?: number;
    };
    trackingExtraInfo?: string;
};

export default InvestigationInfo;