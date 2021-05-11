import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { HistoryState } from '../../InvestigationTable/InvestigationTableInterfaces';

const useDesksFilterCard = () => {
    
    const [filteredDesks, setFilteredDesks] = useState<number[] | null>(null);
    
    const history = useHistory<HistoryState>();    

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