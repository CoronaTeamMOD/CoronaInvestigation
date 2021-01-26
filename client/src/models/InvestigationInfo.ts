import StaticUser from './StaticUser';
import SymptomsExistenceInfo from './SymptomsExistenceInfo';
import InvestigatedPatientStaticInfo from './InvestigatedPatientStaticInfo';

interface InvestigationInfo extends SymptomsExistenceInfo {
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

export interface InvestigationInfoData extends Omit<InvestigationInfo, 'coronaTestDate' | 'symptomsStartDate'> {
    coronaTestDate: string;
    symptomsStartDate: string;
}

export default InvestigationInfo;
