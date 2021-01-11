import { format } from 'date-fns';

const formatDate = (date: Date): string => {
    return (
        date 
        ? format(new Date(date), 'dd/MM/yyyy')
        : 'אין מידע'
    ) 
}

export const formatDateTime = (date: Date): string => {
    return (
        date 
        ? format(new Date(date), 'HH:mm:ss dd/MM/yyyy')
        : 'אין מידע'
    ) 
}

const ISOformatDateIndicator = 'T';
export const truncateDate = (dateInISO : string): Date => {
    return dateInISO ? new Date(dateInISO.split(ISOformatDateIndicator)[0]) : new Date()
}

export default formatDate;