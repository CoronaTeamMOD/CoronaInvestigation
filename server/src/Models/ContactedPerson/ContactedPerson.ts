import { Person } from '../Person/Person';

export interface ContactedPerson {
    doesNeedIsolation: boolean,
    extraInfo: string,
    personByPersonInfo: Person,
}