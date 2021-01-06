import { useState } from 'react';
import { format } from 'date-fns';

import { TimeRange } from 'models/TimeRange';
import timeRanges from 'models/enums/timeRanges';


const dateMissingError = 'יש לבחור תאריך תחילה וסיום';
const rangeError = 'טווח תאריכים צריך להיות תקין';

const useTableFilter = (props : Props) => {
    
    const {timeRangeFilter , onTimeRangeFilterChange} = props;
    const defaultTimeRange = timeRanges[0];
    const customTimeRange = timeRanges[4];
    const [errorMes, setErrorMes] = useState<string>('');

    const onTimeRangeChange = (timeRangeId: number) => {
        const selectedTimeRange = timeRanges.find(timeRange => timeRange.id === timeRangeId) as TimeRange;
        onTimeRangeFilterChange(selectedTimeRange)
    }

    const onStartDateSelect = (startDateInput: Date) => {
        onTimeRangeFilterChange((timeRangeFilter: any) => {
            return {...timeRangeFilter, startDate: format(startDateInput,'yyyy-MM-dd')};
        });
    }

    const onEndDateSelect = (endDateInput :Date) => {
        onTimeRangeFilterChange((timeRangeFilter: any) => {
            return {...timeRangeFilter, endDate: format(endDateInput,'yyyy-MM-dd')};
        });        
    }

    const onUpdateButtonCLicked = () => {
        // if(timeRangeFilter.id !== defaultTimeRange.id) {
        //     if (timeRangeFilter.id === customTimeRange.id) {
        //         if (timeRangeFilter.startDate === null || timeRangeFilter.endDate === null) {
        //             setErrorMes(dateMissingError);
        //         } else if (timeRangeFilter.startDate > timeRangeFilter.endDate) {
        //             setErrorMes(rangeError);
        //         } else {                   
        //             setErrorMes('');
        //             setInvestigationInfoFilter({
        //                 ...investigationInfoFilter,
        //                 timeRange : {startDate: timeRangeFilter.startDate, endDate: timeRangeFilter.endDate}
        //             })
        //         }
        //     } else {
        //         setInvestigationInfoFilter({
        //             ...investigationInfoFilter,
        //             timeRange : {startDate: timeRangeFilter.startDate, endDate: timeRangeFilter.endDate}
        //         })
        //     }
        // } else {
        //     delete investigationInfoFilter.timeRange
        //     setInvestigationInfoFilter({
        //         ...investigationInfoFilter
        //     })
        // }
    }

    return {
        onUpdateButtonCLicked,
        onTimeRangeChange,
        onStartDateSelect,
        onEndDateSelect,
        errorMes
    }
};

interface Props {
    timeRangeFilter: TimeRange;
    onTimeRangeFilterChange: any;
};

export default useTableFilter;