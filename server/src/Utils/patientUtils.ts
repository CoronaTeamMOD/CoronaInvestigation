import { differenceInYears } from 'date-fns';

export const getPatientAge = (birthDate: Date) : number => {
    if (birthDate) return differenceInYears
    (new Date(), new Date(birthDate));
    return -1;
}