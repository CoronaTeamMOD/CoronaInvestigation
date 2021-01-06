import { compareDesc, eachDayOfInterval, subDays } from 'date-fns';

export const symptomsWithKnownStartDate: number = 4;
export const nonSymptomaticPatient: number = 7;
export const symptomsWithUnknownStartDate: number = 7;
export const maxInvestigatedDays: number = 21;

export const getDatesToInvestigate = (doesHaveSymptoms: boolean, symptomsStartDate: Date | null, validationDate: Date | null): Date[] => {
    if (validationDate) {
        const endInvestigationDate = new Date();
        let startInvestigationDate= new Date();
        if (doesHaveSymptoms === true) {
            if (symptomsStartDate)
                startInvestigationDate = subDays(symptomsStartDate, symptomsWithKnownStartDate);
            else
                startInvestigationDate = subDays(new Date(validationDate), symptomsWithUnknownStartDate)
        } else {
            startInvestigationDate = subDays(new Date(validationDate), nonSymptomaticPatient)
        }
        try {
            return eachDayOfInterval({ start: startInvestigationDate, end: endInvestigationDate }).sort(compareDesc);
        } catch (e) {
            return []
        }
    }
    return [];
}

export const getMinimalSymptomsStartDate = (validationDate: Date) => subDays(new Date(validationDate), maxInvestigatedDays)
