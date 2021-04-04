import { format , isValid} from 'date-fns';
import { useEffect, useState } from 'react';

import { TimeRange } from 'models/TimeRange';
import timeRanges, { customTimeRange } from 'models/enums/timeRanges';

const rangeError = 'טווח תאריכים צריך להיות תקין';
const dateInvalid = 'תאריך לא תקין';
const invalidDateString = '9999-99-99';

const useTableFilter = (props : Props) => {
    
    const {timeRangeFilter , onTimeRangeFilterChange} = props;
    
    const [errorMes, setErrorMes] = useState<string>('');
    const [displayTimeRange, setDisplayTimeRange] = useState<TimeRange>(timeRangeFilter);

    useEffect(() => {
        if (displayTimeRange.id === customTimeRange.id){
            if (displayTimeRange.startDate && displayTimeRange.endDate){
                if (!isValid(new Date(displayTimeRange.startDate)) || !isValid(new Date(displayTimeRange.endDate))) {
                    setErrorMes(dateInvalid);
                } else if (displayTimeRange.startDate > displayTimeRange.endDate){
                    setErrorMes(rangeError)
                } else {
                    setErrorMes('');
                    onTimeRangeFilterChange(displayTimeRange);
                }
            }
        } else {
            setErrorMes('');
        }
    }, [displayTimeRange]);

    const onSelectTimeRangeChange = (timeRangeId: number) => {
        const selectedTimeRange = timeRanges.find(timeRange => timeRange.id === timeRangeId) as TimeRange;
        setDisplayTimeRange(selectedTimeRange)
        if (timeRangeId !== customTimeRange.id) {
            onTimeRangeFilterChange(selectedTimeRange)
        }
    }

    const onStartDateSelect = (startDateInput: Date) => {
        const startDate = isValid(startDateInput) ? format(startDateInput, 'yyyy-MM-dd') + 'T00:00:00' : invalidDateString;
        setDisplayTimeRange({...displayTimeRange, startDate});
    }

    const onEndDateSelect = (endDateInput :Date) => {
        const endDate = isValid(endDateInput) ? format(endDateInput, 'yyyy-MM-dd') + 'T23:59:59' : invalidDateString;
        setDisplayTimeRange({...displayTimeRange, endDate});
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