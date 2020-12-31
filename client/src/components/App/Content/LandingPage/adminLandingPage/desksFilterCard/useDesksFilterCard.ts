import axios from 'axios';
import { useEffect, useState } from 'react';

import logger from 'logger/logger';
import Desk from 'models/Desk';
import { Severity } from 'models/Logger';

import AdminLandingPageFilters from '../AdminLandingPageFilters';

interface Props {
    filteredDesks: number[]
    setFilteredDesks: React.Dispatch<React.SetStateAction<number[]>>
    setInvestigationInfoFilter: React.Dispatch<React.SetStateAction<AdminLandingPageFilters>>
}

const useDesksFilterCard = (props : Props) => {
    
    const [desks, setDesks] = useState<Desk[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const {filteredDesks , setFilteredDesks , setInvestigationInfoFilter} = props;

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
    
    useEffect(() => {
        fetchDesks();
    }, []);

    const onDeskClicked = (checkedDesk: number) => {
        if (filteredDesks.includes(checkedDesk)) {
            setFilteredDesks(filteredDesks.filter(desk => desk !== checkedDesk));
        } else {
            setFilteredDesks([...filteredDesks, checkedDesk])
        }
    }

    const onUpdateButtonCLicked = () => {
        if(filteredDesks.length > 0) {
            setInvestigationInfoFilter({
                desks : filteredDesks
            })
        } else {
            setInvestigationInfoFilter({})
        }
    }

    const clearAllDesks = () => {
        setFilteredDesks([])
    }

    return {
        desks,
        isLoading,
        clearAllDesks,
        onUpdateButtonCLicked,
        onDeskClicked
    }

};

export default useDesksFilterCard;