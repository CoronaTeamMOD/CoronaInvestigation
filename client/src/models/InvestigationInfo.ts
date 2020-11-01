import StaticUser from './StaticUser';
import InvestigatedPatientStaticInfo from './InvestigatedPatientStaticInfo';

interface InvestigationInfo {
    comment: string | null;
    startTime: Date;
    lastUpdateTime: Date;
    investigatingUnit: string;
    investigatedPatient: InvestigatedPatientStaticInfo;
    coronaTestDate: Date;
    investigatedPatientId: number;
    userByCreator: StaticUser;
    userByLastUpdator: StaticUser;
    endTime: Date | null;
}

export default InvestigationInfo;
