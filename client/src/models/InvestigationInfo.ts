import StaticUser from './StaticUser';
import { InvestigatedPatientByInvestigatedPatientId } from './InvestigatedPatientByInvestigatedPatientId';

interface InvestigationInfo {
    startTime: Date;
    lastUpdateTime: Date;
    investigatingUnit: string;
    investigatedPatientByInvestigatedPatientId: InvestigatedPatientByInvestigatedPatientId;
    coronaTestDate: Date;
    investigatedPatientId: number;
    userByCreator: StaticUser;
    userByLastUpdator: StaticUser;
}

export default InvestigationInfo;
