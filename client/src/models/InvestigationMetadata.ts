import { StaticUser } from "./StaticUser";

export interface InvestigationMetaData {
    startTime: Date,
    lastUpdateTime: Date,
    investigatingUnit: string,
    userByCreator: StaticUser,
    userByLastUpdator: StaticUser
};