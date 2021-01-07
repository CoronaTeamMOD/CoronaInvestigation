import axios from 'axios';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import Desk from 'models/Desk';
import logger from 'logger/logger';
import { Severity } from 'models/Logger';

import { HistoryState } from '../../InvestigationTable/InvestigationTableInterfaces';

const useDesksFilterCard = () => {
    
    const [desks, setDesks] = useState<Desk[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [filteredDesks, setFilteredDesks] = useState<number[]>([]);
    
    const history = useHistory<HistoryState>();    

    const fetchDesks = () => {
        const fetchDesksLogger = logger.setup('Getting desks');
        fetchDesksLogger.info('launching desks request', Severity.LOW);
        setIsLoading(true);
        axios.get('/desks/county').then(response => {
            fetchDesksLogger.info('The desks were fetched successfully', Severity.LOW);
            const { data } = response;
            setDesks(data);
            setIsLoading(false);
        }).catch(err => {
            fetchDesksLogger.error(`got error from the server: ${err}`, Severity.HIGH);
            setIsLoading(false);
        })
    }

    const getHistoryData = () => {
        const { location: { state } } = history;
        const deskFilter = state?.deskFilter;
        setFilteredDesks(deskFilter || []);
    }
    
    useEffect(() => {
        fetchDesks();
        getHistoryData();
    }, []);

    const onDeskClicked = (checkedDesk: number) => {
        if (filteredDesks.includes(checkedDesk)) {
            setFilteredDesks(filteredDesks.filter(desk => desk !== checkedDesk));
        } else {
            setFilteredDesks([...filteredDesks, checkedDesk])
        }
    }

    const clearAllDesks = () => {
        setFilteredDesks([])
    }

    return {
        desks,
        isLoading,
        filteredDesks,
        clearAllDesks,
        onDeskClicked,
    }
};

export default useDesksFilterCard;