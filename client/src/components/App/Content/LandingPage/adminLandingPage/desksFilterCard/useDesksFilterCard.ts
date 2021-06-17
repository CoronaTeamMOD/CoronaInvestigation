import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import StoreStateType from 'redux/storeStateType';

import { HistoryState } from '../../InvestigationTable/InvestigationTableInterfaces';

const useDesksFilterCard = () => {
    
    const [filteredDesks, setFilteredDesks] = useState<number[] | null>(null);
    
    const history = useHistory<HistoryState>();    
    const displayedCounty = useSelector<StoreStateType, number>(state => state.user.displayedCounty);

    useEffect(() => {
        clearAllDesks();
    }, [displayedCounty])

    const getHistoryData = () => {
        const { location: { state } } = history;
        const deskFilter = state?.deskFilter as number[];
        setFilteredDesks(deskFilter || []);
    }
    
    useEffect(() => {
        getHistoryData();
    }, []);

    const onDeskClicked = (checkedDesk: number) => {
        if(filteredDesks) {
            if (filteredDesks.includes(checkedDesk)) {
                setFilteredDesks(filteredDesks.filter(desk => desk !== checkedDesk));
            } else {
                setFilteredDesks([...filteredDesks, checkedDesk])
            }
        }
    }

    const clearAllDesks = () => {
        setFilteredDesks([])
    }

    return {
        filteredDesks,
        clearAllDesks,
        onDeskClicked,
    }
};

export default useDesksFilterCard;