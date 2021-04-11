import { format } from 'date-fns';

const DEFAULT_NO_INFO_TEXT = 'אין מידע';

const formatDate = (date?: Date | string | null, noInfoText? : string): string => {
    return (
        date 
        ? format(new Date(date), 'dd/MM/yyyy')
        : noInfoText ?? DEFAULT_NO_INFO_TEXT
    ) 
}

export const formatDateTime = (date: Date, noInfoText? : string): string => {
    return (
        date 
        ? format(new Date(date), 'HH:mm:ss dd/MM/yyyy')
        : noInfoText ?? DEFAULT_NO_INFO_TEXT
    ) 
}

const ISOformatDateIndicator = 'T';
export const truncateDate = (dateInISO : string): Date => {
    return dateInISO ? new Date(dateInISO.split(ISOformatDateIndicator)[0]) : new Date()
}

export default formatDate;