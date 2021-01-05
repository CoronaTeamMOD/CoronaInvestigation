import { format, subDays } from 'date-fns';

import { TimeRange } from 'models/TimeRange';

const timeRanges: TimeRange[] = [
    {
        id: 10,
        displayName: 'הכל',
        endDate: format(new Date(),'yyyy-MM-dd'),
        startDate: format(new Date(),'yyyy-MM-dd')
    },
    {
        id: 1,
        displayName: 'יום אחרון',
        endDate: format(new Date(),'yyyy-MM-dd'),
        startDate: format(subDays(new Date(), 1),'yyyy-MM-dd')
    },
    {
        id: 3,
        displayName: '3 ימים  אחרונים',
        endDate: format(new Date(),'yyyy-MM-dd'),
        startDate: format(subDays(new Date(), 3),'yyyy-MM-dd')
    },
    {
        id: 7,
        displayName: '7 ימים אחרונים',
        endDate: format(new Date(),'yyyy-MM-dd'),
        startDate: format(subDays(new Date(), 7),'yyyy-MM-dd')
    },
    {
        id: -1,
        displayName: 'בחירת תאריכים',
        endDate: format(new Date(),'yyyy-MM-dd'),
        startDate: format((new Date()),'yyyy-MM-dd')
    }
];

export default timeRanges;