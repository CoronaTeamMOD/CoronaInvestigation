import { Person } from "./Person";

export interface InvestigationInfo {
    startTime: Date,
    lastUpdateTime: Date,
    investigatingUnit: string,
    userByCreator: {
        personByPersonId: Person
    },
    userByLastUpdator: {
        personByPersonId: Person
    }
    investigatedPatientByInvestigatedPatientId: InvestigatedPatientByInvestigatedPatientId
    coronaTestDate: Date
}

export interface InvestigatedPatientByInvestigatedPatientId {
    personByPersonId: Person,
    isDeceased: boolean
}

export interface InvestigationMetaData {
    startTime: Date,
    lastUpdateTime: Date,
    investigatingUnit: string,
    userByCreator: {
        personByPersonId: Person
    },
    userByLastUpdator: {
        personByPersonId: Person
    }
}