import {differenceInDays, eachDayOfInterval, subDays} from 'date-fns';

import useCustomSwal from 'commons/CustomSwal/useCustomSwal';

// TODO - DELETE
export const symptomsWithKnownStartDate: number = 4;
export const nonSymptomaticPatient: number = 7;
export const symptomsWithUnknownStartDate: number = 7;
// TODO - LIMIT ON INPUT
const maxInvestigatedDays: number = 21;

// TODO - CHANGE NAME
export const useDateUtils = (): useDateUtilsOutCome => {
    
    const convertDate = (dbDate: Date | null) => dbDate ? new Date(dbDate) : null;

    // TODO - DELETE
    const getDatesToInvestigate = (doesHaveSymptoms: boolean, symptomsStartDate: Date | null, validationDate: Date | null): Date[] => {
        if (validationDate !== null) {
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
    return {
        convertDate,
        getDatesToInvestigate
    }
}

export interface useDateUtilsOutCome {
    convertDate: (dbDate: Date | null) => Date | null;
    getDatesToInvestigate: (doesHaveSymptoms: boolean, symptomsStartDate: Date | null, coronaTestDate: Date | null) => Date[];
}