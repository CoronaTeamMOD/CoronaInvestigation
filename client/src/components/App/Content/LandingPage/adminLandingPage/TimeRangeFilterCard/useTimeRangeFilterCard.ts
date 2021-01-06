import { useEffect, useState } from 'react';
import { format, parse } from 'date-fns';

import { TimeRange } from 'models/TimeRange';
import timeRanges from 'models/enums/timeRanges';

import AdminLandingPageFilters from '../AdminLandingPageFilters';

const dateMissingError = 'יש לבחור תאריך תחילה וסיום';
const rangeError = 'טווח תאריכים צריך להיות תקין';

const useTimeRangeFilterCard = (props : Props) => {
    
    const {timeRangeFilter , setTimeRangeFilter, investigationInfoFilter, setInvestigationInfoFilter} = props;

    const defaultTimeRange = timeRanges[0];
    const customTimeRange = timeRanges[4];
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMes, setErrorMes] = useState<string>('');
    
    const onTimeRangeChange = (timeRangeId: number) => {
        const selectedTimeRange = timeRanges.find(timeRange => timeRange.id === timeRangeId) as TimeRange;
        setTimeRangeFilter(selectedTimeRange)
    }

    const onStartDateSelect = (startDateInput: Date) => {
        setTimeRangeFilter((timeRangeFilter) => {
            return {...timeRangeFilter, startDate: format(startDateInput,'yyyy-MM-dd')};
        });
    }

    const onEndDateSelect = (endDateInput :Date) => {
        setTimeRangeFilter((timeRangeFilter) => {
            return {...timeRangeFilter, endDate: format(endDateInput,'yyyy-MM-dd')};
        });        
    }

    const onUpdateButtonCLicked = () => {
        if(timeRangeFilter.id !== defaultTimeRange.id) {
            if (timeRangeFilter.id == customTimeRange.id) {
                if (timeRangeFilter.startDate === null || timeRangeFilter.endDate === null) {
                    setErrorMes(dateMissingError);
                } else if (timeRangeFilter.startDate > timeRangeFilter.endDate) {
                    setErrorMes(rangeError);
                } else {                   
                    setErrorMes('');
                    setInvestigationInfoFilter({
                        ...investigationInfoFilter,
                        timeRange : {startDate: timeRangeFilter.startDate, endDate: timeRangeFilter.endDate}
                    })
                }
            } else {
                setInvestigationInfoFilter({
                    ...investigationInfoFilter,
                    timeRange : {startDate: timeRangeFilter.startDate, endDate: timeRangeFilter.endDate}
                })
            }
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
        onStartDateSelect,
        onEndDateSelect,
        errorMes
    }
};

interface Props {
    timeRangeFilter: TimeRange;
    setTimeRangeFilter: React.Dispatch<React.SetStateAction<TimeRange>>;
    investigationInfoFilter: AdminLandingPageFilters;
    setInvestigationInfoFilter: React.Dispatch<React.SetStateAction<AdminLandingPageFilters>>;
};

export default useTimeRangeFilterCard;