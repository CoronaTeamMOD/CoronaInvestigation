import { useState } from 'react';
import { format } from 'date-fns';

import { TimeRange } from 'models/TimeRange';
import timeRanges from 'models/enums/timeRanges';

import AdminLandingPageFilters from '../AdminLandingPageFilters';

const useTimeRangeFilterCard = (props : Props) => {
    
    const defaultTimeRange = timeRanges[0];
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const {timeRangeFilter , setTimeRangeFilter, investigationInfoFilter, setInvestigationInfoFilter} = props;

    const onTimeRangeChange = (timeRangeId: number) => {
        const selectedTimeRange = timeRanges.find(timeRange => timeRange.id === timeRangeId) as TimeRange;
        setTimeRangeFilter(selectedTimeRange)
    }

    const onStartDateSelect = (startDateInput: Date) => {
        setStartDate(startDateInput)
        const selectedTimeRange = {...timeRanges[4], startDate: format(startDateInput,'yyyy-MM-dd'),}
        setTimeRangeFilter(selectedTimeRange)
    }

    const onEndDateSelect = (endDateInput :Date) => {
        setEndDate(endDateInput)
        const selectedTimeRange = {...timeRanges[4], endDate: format(endDateInput,'yyyy-MM-dd'),}
        setTimeRangeFilter(selectedTimeRange)
    }

    const onUpdateButtonCLicked = () => {
        if(timeRangeFilter.id !== defaultTimeRange.id) {
            setInvestigationInfoFilter({
                ...investigationInfoFilter,
                timeRange : {startDate: timeRangeFilter.startDate, endDate: timeRangeFilter.endDate}
            })
        } else {
            delete investigationInfoFilter.timeRange
            setInvestigationInfoFilter({
                ...investigationInfoFilter
            })
        }
    }

    return {
        isLoading,
        onUpdateButtonCLicked,
        onTimeRangeChange,
        startDate,
        onStartDateSelect,
        endDate,
        onEndDateSelect
    }
};

interface Props {
    timeRangeFilter: TimeRange;
    setTimeRangeFilter: React.Dispatch<React.SetStateAction<TimeRange>>;
    investigationInfoFilter: AdminLandingPageFilters;
    setInvestigationInfoFilter: React.Dispatch<React.SetStateAction<AdminLandingPageFilters>>;
};

export default useTimeRangeFilterCard;