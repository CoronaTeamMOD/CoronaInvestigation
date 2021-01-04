import { useState } from 'react';

import { TimeRange } from 'models/TimeRange';
import timeRanges from 'models/enums/timeRanges';

import AdminLandingPageFilters from '../../AdminLandingPageFilters';

const useTimeRangeFilterCard = (props : Props) => {
    
    const defaultTimeRange = timeRanges[0];
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {timeRangeFilter , setTimeRangeFilter, investigationInfoFilter, setInvestigationInfoFilter} = props;

    const onTimeRangeChange = (timeRangeId: number) => {
        const selectedTimeRange = timeRanges.find(timeRange => timeRange.id === timeRangeId) as TimeRange;
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
        onTimeRangeChange
    }
};

interface Props {
    timeRangeFilter: TimeRange;
    setTimeRangeFilter: React.Dispatch<React.SetStateAction<TimeRange>>;
    investigationInfoFilter: AdminLandingPageFilters;
    setInvestigationInfoFilter: React.Dispatch<React.SetStateAction<AdminLandingPageFilters>>;
};

export default useTimeRangeFilterCard;