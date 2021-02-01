import { addDays, compareDesc, eachDayOfInterval, startOfDay, subDays } from 'date-fns';

export const symptomsWithKnownStartDate: number = 4;
export const nonSymptomaticPatient: number = 7;
export const symptomsWithUnknownStartDate: number = 7;
export const maxInvestigatedDays: number = 21;
export const maxIsolationDays: number = 14;

export const getDatesToInvestigate = (doesHaveSymptoms: boolean, symptomsStartDate: Date | null, validationDate: Date | null): Date[] => {
    if (validationDate) {
        const endInvestigationDate = new Date();
        let startInvestigationDate= new Date();
        if (doesHaveSymptoms === true) {
            if (symptomsStartDate && symptomsStartDate <= addDays(validationDate , 1))
                startInvestigationDate = subDays(symptomsStartDate, symptomsWithKnownStartDate);
            else
                startInvestigationDate = subDays(validationDate, symptomsWithUnknownStartDate)
        } else {
            startInvestigationDate = subDays(validationDate, nonSymptomaticPatient)
        }
        try {
            return eachDayOfInterval({ start: startOfDay(startInvestigationDate), end: endInvestigationDate }).sort(compareDesc);
        } catch (e) {
            return []
        }
    }
    return [];
}

export const getMinimalSymptomsStartDate = (validationDate: Date) => subDays(new Date(validationDate), maxInvestigatedDays);

export const getMinimalStartIsolationDate = (validationDate: Date) => subDays(new Date(validationDate), maxIsolationDays);