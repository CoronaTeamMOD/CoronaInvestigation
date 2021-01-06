
export const useDateUtils = (): useDateUtilsOutCome => {
    
    const convertDate = (dbDate: Date | null) => dbDate ? new Date(dbDate) : null;

    return {
        convertDate,
    }
}

export interface useDateUtilsOutCome {
    convertDate: (dbDate: Date | null) => Date | null;
}