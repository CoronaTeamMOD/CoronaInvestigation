import { format } from 'date-fns';

const formatDate = (date: Date): string => {
    return (
        date 
        ? format(new Date(date), 'dd/MM/yyyy')
        : 'אין מידע'
    ) 
}

export default formatDate;