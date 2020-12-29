import axios from 'axios';
import logger from 'logger/logger';
import Desk from 'models/Desk';
import { Severity } from 'models/Logger';
import { useEffect, useState } from 'react';

const useDesksFilterCard = () => {
    
    const [desks, setDesks] = useState<Desk[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

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

    return {
        desks,
        isLoading
    }

};

export default useDesksFilterCard;