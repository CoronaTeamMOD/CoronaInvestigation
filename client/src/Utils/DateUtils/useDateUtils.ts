import {differenceInDays, eachDayOfInterval, subDays} from 'date-fns';

import useCustomSwal from 'commons/CustomSwal/useCustomSwal';

export const symptomsWithKnownStartDate: number = 4;
export const nonSymptomaticPatient: number = 7;
export const symptomsWithUnknownStartDate: number = 10;
const maxInvestigatedDays: number = 21;

export const useDateUtils = (): useDateUtilsOutCome => {
    const { alertError } = useCustomSwal();

    const convertDate = (dbDate: Date | null) => dbDate ? new Date(dbDate) : null;

    const getDatesToInvestigate = (doesHaveSymptoms: boolean, symptomsStartDate: Date | null, coronaTestDate: Date | null): Date[] => {
        if (coronaTestDate !== null) {
            const endInvestigationDate = new Date();
            let startInvestigationDate: Date;
            if (doesHaveSymptoms) {
                if (symptomsStartDate) {
                    const testAndSymptomsInterval = Math.abs(differenceInDays(symptomsStartDate, coronaTestDate));
                    if (testAndSymptomsInterval > maxInvestigatedDays) {
                        alertError('תאריך סימפטומים לא חוקי')
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

    return {
        convertDate,
        getDatesToInvestigate
    }
}

interface useDateUtilsOutCome {
    convertDate: (dbDate: Date | null) => Date | null;
    getDatesToInvestigate: (doesHaveSymptoms: boolean, symptomsStartDate: Date | null, coronaTestDate: Date | null) => Date[];
}