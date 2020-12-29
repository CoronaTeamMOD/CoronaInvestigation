import axios from 'axios';
import logger from 'logger/logger';
import Desk from 'models/Desk';
import { Severity } from 'models/Logger';
import { useEffect, useState } from 'react';

const useDesksFilterCard = () => {
    
    const [desks, setDesks] = useState<Desk[]>([]);

    const fetchDesks = () => {
        const fetchDesksLogger = logger.setup('Getting desks');
        fetchDesksLogger.info('launching desks request', Severity.LOW);
        axios.get('/desks').then(response => {
            fetchDesksLogger.info('The desks were fetched successfully', Severity.LOW);
            const { data } = response;
            setDesks(data);
        }).catch(err => {
            fetchDesksLogger.error(`got error from the server: ${err}`, Severity.HIGH);
        })
    }
    
    useEffect(() => {
        fetchDesks();
    }, []);

    return {
        desks
    }

};

export default useDesksFilterCard;