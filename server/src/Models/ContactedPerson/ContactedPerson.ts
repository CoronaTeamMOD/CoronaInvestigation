import { Person } from '../Person/Person';

export interface ContactedPerson {
    extraInfo: string,
    personByPersonInfo: Person,
    id: number,
}