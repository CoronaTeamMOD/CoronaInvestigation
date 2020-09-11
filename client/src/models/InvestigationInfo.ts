import { StaticUser } from "./StaticUser";
import { InvestigatedPatientByInvestigatedPatientId } from "./InvestigatedPatientByInvestigatedPatientId";

export interface InvestigationInfo {
    startTime: Date,
    lastUpdateTime: Date,
    investigatingUnit: string,
    investigatedPatientByInvestigatedPatientId: InvestigatedPatientByInvestigatedPatientId
    coronaTestDate: Date,
    investigatedPatientId: number,
    userByCreator: StaticUser,
    userByLastUpdator: StaticUser
}
