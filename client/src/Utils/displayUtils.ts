import { Person } from "models/Person"

export const timeFormat : string = 'HH:mm';

export const getPersonFullName = (personData: Person) => {
    return personData.firstName + ' ' + personData.lastName;
}

export const dateFormatForDatePicker = 'yyyy-MM-dd'; 
