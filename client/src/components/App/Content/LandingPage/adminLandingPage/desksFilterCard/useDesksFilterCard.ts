import React from 'react';
import axios from 'axios';

import Desk from 'models/Desk';
import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';

interface Props {
    setAllDesks: React.Dispatch<React.SetStateAction<Desk[]>>
}

const useDesksFilterCard = (props : Props) => {
    const { setAllDesks } = props;
    const { alertError } = useCustomSwal();
    
    const setAllDesksAsync = async () => {
        setAllDesks(await fetchAllDesks());
    }

    const fetchAllDesks = async () => {
        const desksByCountyIdLogger = logger.setup('Getting Desks by county id');
        return await axios
            .get('/desks/county')
            .then((result) => {
                if (result?.data && result.headers['content-type'].includes('application/json')) {
                    desksByCountyIdLogger.info('The desks were fetched successfully', Severity.LOW);
                    return ([{ id: -1, deskName: 'לא שוייך לדסק' }, ...result.data]);
                } else {
                    desksByCountyIdLogger.error('Got 200 status code but results structure isnt as expected', Severity.HIGH);
                    return [];
                }
            })
            .catch((err) => {
                alertError('לא הצלחנו לשלוף את כל הדסקים האפשריים לסינון');
                desksByCountyIdLogger.error(err, Severity.HIGH);
                return [];
            });
    };

    return {
        setAllDesksAsync
    };
};

export default useDesksFilterCard;
