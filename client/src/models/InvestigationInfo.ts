import StaticUser from './StaticUser';
import InvestigatedPatientStaticInfo from './InvestigatedPatientStaticInfo';

interface InvestigationInfo {
    startTime: Date;
    lastUpdateTime: Date;
    investigatingUnit: string;
    investigatedPatient: InvestigatedPatientStaticInfo;
    coronaTestDate: Date;
    investigatedPatientId: number;
    userByCreator: StaticUser;
    userByLastUpdator: StaticUser;
}

export default InvestigationInfo;
