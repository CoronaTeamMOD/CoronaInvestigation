import Swal from "sweetalert2";
import {differenceInDays, eachDayOfInterval, subDays} from 'date-fns';

export const symptomsWithKnownStartDate: number = 4;
export const nonSymptomaticPatient: number = 7;
export const symptomsWithUnknownStartDate: number = 10;
const maxInvestigatedDays: number = 21;

export const convertDate = (dbDate: Date | null) => dbDate ? new Date(dbDate) : null;


export const getDatesToInvestigate = (doesHaveSymptoms: boolean, symptomsStartDate: Date | null, coronaTestDate: Date | null): Date[] => {
    if (coronaTestDate !== null) {
        const endInvestigationDate = new Date();
        let startInvestigationDate: Date;
        if (doesHaveSymptoms) {
            if (symptomsStartDate) {
                const testAndSymptomsInterval = Math.abs(differenceInDays(symptomsStartDate, coronaTestDate));
                if (testAndSymptomsInterval > maxInvestigatedDays) {
                    Swal.fire({
                        title: 'תאריך התחלת סימפטומים לא חוקי',
                        icon: 'error'
                    });
                    return [];
                }
                startInvestigationDate = subDays(symptomsStartDate, symptomsWithKnownStartDate);
            }
            else
                startInvestigationDate = subDays(coronaTestDate, symptomsWithUnknownStartDate)
        } else {
            startInvestigationDate = subDays(coronaTestDate, nonSymptomaticPatient)
        }
        try {
            return eachDayOfInterval({ start: startInvestigationDate, end: endInvestigationDate });
        } catch (e) {
            return []
        }
    }
    return [];
}