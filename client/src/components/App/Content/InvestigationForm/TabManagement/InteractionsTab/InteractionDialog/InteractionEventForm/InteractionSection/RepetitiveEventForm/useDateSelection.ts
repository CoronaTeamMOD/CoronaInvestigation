import {isSameDay} from "date-fns";
import React from "react";

const useDateSelection = () => {
    const [selectedDates, setSelectedDates] = React.useState<Date[]>([]);

    const initializeSelectedDate = (date: Date) => setSelectedDates([date]);

    const onDateCheckClick = (date: Date, isChecked: boolean) => {
        isChecked
            ? setSelectedDates(prevDates => prevDates.concat(date))
            : setSelectedDates(prevDates => prevDates.filter(selectedDay => !isSameDay(selectedDay, date)))
    };

    const isDateSelected = (date: Date) => selectedDates.some(selectedDay => isSameDay(selectedDay, date));

    return {
        onDateCheckClick,
        isDateSelected,
        initializeSelectedDate,
        selectedDates
    }
};

export default useDateSelection;