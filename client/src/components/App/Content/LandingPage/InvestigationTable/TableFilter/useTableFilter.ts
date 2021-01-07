import { format } from 'date-fns';
import { useEffect, useState } from 'react';

import { TimeRange } from 'models/TimeRange';
import timeRanges, { customTimeRange } from 'models/enums/timeRanges';

const rangeError = 'טווח תאריכים צריך להיות תקין';

const useTableFilter = (props : Props) => {
    
    const {timeRangeFilter , onTimeRangeFilterChange} = props;
    
    const [errorMes, setErrorMes] = useState<string>('');
    const [displayTimeRange, setDisplayTimeRange] = useState<TimeRange>(timeRangeFilter);

    useEffect(() => {
        if (displayTimeRange.id === customTimeRange.id){
            if (displayTimeRange.startDate && displayTimeRange.endDate){
                if (displayTimeRange.startDate > displayTimeRange.endDate){
                    setErrorMes(rangeError)
                } else {
                    setErrorMes('');
                    onTimeRangeFilterChange(displayTimeRange);
                }
            }
        }
    }, [displayTimeRange])

    const onSelectTimeRangeChange = (timeRangeId: number) => {
        const selectedTimeRange = timeRanges.find(timeRange => timeRange.id === timeRangeId) as TimeRange;
        setDisplayTimeRange(selectedTimeRange)
        if (timeRangeId !== customTimeRange.id) {
            onTimeRangeFilterChange(selectedTimeRange)
        }
    }

    const onStartDateSelect = (startDateInput: Date) => {
        setDisplayTimeRange({...displayTimeRange, startDate: format(startDateInput,'yyyy-MM-dd')})
    }

    const onEndDateSelect = (endDateInput :Date) => {
        setDisplayTimeRange({...displayTimeRange, endDate: format(endDateInput,'yyyy-MM-dd')})       
    }

    return {
        onSelectTimeRangeChange,
        displayTimeRange,
        onStartDateSelect,
        onEndDateSelect,
        errorMes
    }
};

interface Props {
    timeRangeFilter: TimeRange;
    onTimeRangeFilterChange: (timeRange: TimeRange) => void;
};

export default useTableFilter;