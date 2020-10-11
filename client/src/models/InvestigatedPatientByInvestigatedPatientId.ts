import Person from './Person';

export interface InvestigatedPatientByInvestigatedPatientId {
    isDeceased: boolean;
    personByPersonId: Person;
}
