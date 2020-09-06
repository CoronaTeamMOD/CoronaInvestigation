import { Person } from "models/Person"

export const getPersonFullName = (personData: Person) => {
    return personData.firstName + ' '
            + personData.lastName
}