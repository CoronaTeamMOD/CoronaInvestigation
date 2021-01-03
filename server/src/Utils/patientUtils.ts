import { differenceInYears } from 'date-fns';

export const getPatientAge = (birthDate: Date) : number => {
    return Boolean(birthDate) ? differenceInYears(new Date(), new Date(birthDate)) : null
}