import React from 'react';
import {useSelector} from 'react-redux';
import StoreStateType from 'redux/storeStateType';
import {isSameDay} from 'date-fns';

const MAX_DAYS_TO_DISPLAY = 7;
const EDGE_DAYS_TO_DISPLAY = (MAX_DAYS_TO_DISPLAY - 1) / 2;
const firstPossibleIndex = 0;

const useDateLoading = () => {
    const [firstDayToDisplay, setFirstDayToDisplay] = React.useState<number>(0);
    const [lastDayToDisplay, setLastDayToDisplay] = React.useState<number>(0);
    const datesToOffer = useSelector<StoreStateType, Date[]>((state) => state.investigation.datesToInvestigate);

    const lastPossibleIndex = React.useMemo(() => datesToOffer.length - 1, [datesToOffer]);

    const getNextFutureIndex = (prevLastIndex: number) => {
        return Math.min(lastPossibleIndex,prevLastIndex + EDGE_DAYS_TO_DISPLAY)
    };

    const getNextPastIndex = (prevFirstIndex: number) => {
        return Math.max(firstPossibleIndex, prevFirstIndex - EDGE_DAYS_TO_DISPLAY)
    };

    const loadNextDays = () => {
        setLastDayToDisplay(getNextFutureIndex)
    };

    const loadPreviousDays = () => {
        setFirstDayToDisplay(getNextPastIndex)
    };

    const hasPastDaysToLoad = React.useMemo(() => firstDayToDisplay > firstPossibleIndex, [firstDayToDisplay]);
    const hasFutureDaysToLoad = React.useMemo(() => lastDayToDisplay < lastPossibleIndex, [lastDayToDisplay]);
    const daysToDisplay = React.useMemo(() => datesToOffer.slice(firstDayToDisplay, lastDayToDisplay + 1), [firstDayToDisplay, lastDayToDisplay]);

    const initializeEdgeIndexes = (selectedDate: Date) => {
        const selectedDateIndex = datesToOffer.findIndex(date => isSameDay(date, selectedDate));
        setFirstDayToDisplay(getNextPastIndex(selectedDateIndex));
        setLastDayToDisplay(getNextFutureIndex(selectedDateIndex))
    };

    return {
        loadNextDays,
        loadPreviousDays,
        initializeEdgeIndexes,
        hasPastDaysToLoad,
        hasFutureDaysToLoad,
        daysToDisplay
    }
};

export default useDateLoading;