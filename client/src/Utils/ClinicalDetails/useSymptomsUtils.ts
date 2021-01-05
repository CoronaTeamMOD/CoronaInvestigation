import { eachDayOfInterval, subDays } from 'date-fns';

export const symptomsWithKnownStartDate: number = 4;
export const nonSymptomaticPatient: number = 7;
export const symptomsWithUnknownStartDate: number = 7;

export const getDatesToInvestigate = (doesHaveSymptoms: boolean, symptomsStartDate: Date | null, validationDate: Date | null): Date[] => {
    if (validationDate) {
        const endInvestigationDate = new Date();
        let startInvestigationDate: Date;
        if (doesHaveSymptoms === true) {
            if (symptomsStartDate)
                startInvestigationDate = subDays(symptomsStartDate, symptomsWithKnownStartDate);
            else
                startInvestigationDate = subDays(validationDate, symptomsWithUnknownStartDate)
        } else {
            startInvestigationDate = subDays(validationDate, nonSymptomaticPatient)
        }
        try {
            return eachDayOfInterval({ start: startInvestigationDate, end: endInvestigationDate });
        } catch (e) {
            return []
        }
    }
    return [];
}