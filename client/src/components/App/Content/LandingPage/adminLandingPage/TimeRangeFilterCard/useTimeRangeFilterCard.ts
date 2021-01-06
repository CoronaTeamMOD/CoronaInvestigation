import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useHistory } from 'react-router-dom';

import { TimeRange } from 'models/TimeRange';
import timeRanges from 'models/enums/timeRanges';

import { HistoryState } from '../../InvestigationTable/InvestigationTableInterfaces';

const dateMissingError = 'יש לבחור תאריך תחילה וסיום';
const dateInvalid = 'תאריך לא תקין';
const rangeError = 'טווח תאריכים צריך להיות תקין';
export const defaultTimeRange = timeRanges[0];
const customTimeRange = timeRanges[4];

const useTimeRangeFilterCard = () => {
    
    const [errorMes, setErrorMes] = useState<string>('');
    const [timeRangeFilter, setTimeRangeFilter] = useState<TimeRange>(timeRanges[0]);

    const history = useHistory<HistoryState>();    

    const onTimeRangeChange = (timeRangeId: number) => {
        const selectedTimeRange = timeRanges.find(timeRange => timeRange.id === timeRangeId) as TimeRange;
        setTimeRangeFilter(selectedTimeRange);
    }

    const getHistoryData = () => {
        const { location: { state } } = history;
        const timeRangeFilter = state?.timeRangeFilter;
        setTimeRangeFilter(timeRangeFilter || defaultTimeRange);
    }

    useEffect(() => {
        getHistoryData();
    }, [])

    const onStartDateSelect = (startDateInput: Date) => {
        let startDate = '';
        try {
            startDate = format(startDateInput,'yyyy-MM-dd');
            setTimeRangeFilter((timeRangeFilter) => {
                return {...timeRangeFilter, startDate};
            });
            setErrorMes('');
        } catch {
            setErrorMes(dateInvalid);
        }
    }

    const onEndDateSelect = (endDateInput :Date) => {
        let endDate = '';
        try {
            endDate = format(endDateInput,'yyyy-MM-dd');
            setTimeRangeFilter((timeRangeFilter) => {
                return {...timeRangeFilter, endDate};
            });
            setErrorMes('');
        } catch {
            setErrorMes(dateInvalid);
        }
    }

    const validateTimeRange = () : boolean => {
        if (timeRangeFilter.id === customTimeRange.id) {
            if (timeRangeFilter.startDate === null || timeRangeFilter.endDate === null) {
                setErrorMes(dateMissingError);
                return false;
            } else if (timeRangeFilter.startDate > timeRangeFilter.endDate) {
                setErrorMes(rangeError);
                return false;
            }
        }

        return true;
    }

    return {
        timeRangeFilter,
        errorMes,
        validateTimeRange,
        onTimeRangeChange,
        onStartDateSelect,
        onEndDateSelect,
    }
};

export default useTimeRangeFilterCard;