import { format, isValid } from 'date-fns';
import { useEffect, useState } from 'react';

import { TimeRange } from 'models/TimeRange';
import timeRanges, { customTimeRange, defaultTimeRange } from 'models/enums/timeRanges';
import { AgeRange } from 'models/AgeRange';
import ageRange, { AgeRangeCodes, defaultAgeRange } from 'models/enums/AgeRange';

const rangeError = 'טווח תאריכים צריך להיות תקין';
const dateInvalid = 'תאריך לא תקין';
const invalidDateString = '9999-99-99';

const ageRangeError = 'טווח לא תקין';
const ageFormatError = 'גיל בטווח 0-150';

const useTableFilter = (props: Props) => {

    const { timeRangeFilter, onTimeRangeFilterChange, ageFilter, changeAgeFilter } = props;

    const [errorMes, setErrorMes] = useState<string>('');
    const [ageErrMsg, setAgeErrMsg] = useState<string>('');
    const [displayTimeRange, setDisplayTimeRange] = useState<TimeRange>(timeRangeFilter);
    const [selectedAgeOption, setSelectedAgeOption] = useState<AgeRange>(ageFilter);

    useEffect(() => {
        if (displayTimeRange.id === customTimeRange.id) {
            if (displayTimeRange.startDate && displayTimeRange.endDate) {
                if (!isValid(new Date(displayTimeRange.startDate)) || !isValid(new Date(displayTimeRange.endDate))) {
                    setErrorMes(dateInvalid);
                } else if (displayTimeRange.startDate > displayTimeRange.endDate) {
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

    useEffect(() => {
        if (selectedAgeOption.id == AgeRangeCodes.RANGE) {
            if (ageValidation(selectedAgeOption.ageFrom, selectedAgeOption.ageTo)) {
                changeAgeFilter(selectedAgeOption);
            }
        }
    }, [selectedAgeOption])

    const onSelectTimeRangeChange = (timeRangeId: number) => {
        const selectedTimeRange = timeRanges.find(timeRange => timeRange.id === timeRangeId) as TimeRange;
        setDisplayTimeRange(selectedTimeRange)
        if (timeRangeId !== customTimeRange.id) {
            onTimeRangeFilterChange(selectedTimeRange)
        }
    }

    const onStartDateSelect = (startDateInput: Date) => {
        const startDate = isValid(startDateInput) ? format(startDateInput, 'yyyy-MM-dd') + 'T00:00:00' : invalidDateString;
        setDisplayTimeRange({ ...displayTimeRange, startDate });
    }

    const onEndDateSelect = (endDateInput: Date) => {
        const endDate = isValid(endDateInput) ? format(endDateInput, 'yyyy-MM-dd') + 'T23:59:59' : invalidDateString;
        setDisplayTimeRange({ ...displayTimeRange, endDate });
    }

    const resetTimeRange = () => {
        setDisplayTimeRange(defaultTimeRange);
        onTimeRangeFilterChange(defaultTimeRange);
    }

    const onAgeRangeChange = (ageRangeId: number) => {
        const selectedAgeRange = ageRange.find(range => range.id === ageRangeId) as AgeRange;
        setSelectedAgeOption(selectedAgeRange);
        if (ageRangeId !== AgeRangeCodes.RANGE) {
            changeAgeFilter(selectedAgeRange);
        }
    }
    const onMinAgeChanged = (age: string) => {
        setSelectedAgeOption({ ...selectedAgeOption, ageFrom: isNaN(Number(age)) || !age ? null : +age });
    }

    const onMaxAgeChanged = (age: string) => {
        setSelectedAgeOption({ ...selectedAgeOption, ageTo: isNaN(Number(age)) || !age ? null : +age });
    }

    const ageValidation = (minAge: number | null, maxAge: number | null) => {
        if (minAge == null || maxAge == null || isNaN(Number(minAge)) || isNaN(Number(maxAge))) {
            setAgeErrMsg(ageFormatError);
            return false;
        }
        else if (!checkAgeNumber(Number(minAge)) || !checkAgeNumber(Number(maxAge))) {
            setAgeErrMsg(ageFormatError);
            return false;
        }
        else if (Number(maxAge) < Number(minAge)) {
            setAgeErrMsg(ageRangeError);
            return false;
        }
        else {
            setAgeErrMsg('');
            return true;
        }
    }
    const checkAgeNumber = (age: number) => {
        return (age >= 0 && age <= 150);
    }
    const resetAgeRange = () => {
        setSelectedAgeOption(defaultAgeRange);
        changeAgeFilter(defaultAgeRange);
    }

    return {
        onSelectTimeRangeChange,
        displayTimeRange,
        onStartDateSelect,
        onEndDateSelect,
        errorMes,
        selectedAgeOption,
        onAgeRangeChange,
        onMinAgeChanged,
        onMaxAgeChanged,
        ageErrMsg,
        resetTimeRange,
        resetAgeRange,
    }
};

interface Props {
    timeRangeFilter: TimeRange;
    onTimeRangeFilterChange: (timeRange: TimeRange) => void;
    ageFilter: AgeRange;
    changeAgeFilter: (ageFilter: AgeRange) => void;
};

export default useTableFilter;