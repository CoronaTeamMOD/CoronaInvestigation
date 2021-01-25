import axios from 'axios';
import { useEffect } from 'react';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';

const useGroupedInvestigationsTab = (props : Props) => {
    const { setGroupId } = props;
    
    const fetchGroupedId = async () => {
        const groupIdByEpidemiologyNumberLogger = logger.setup('Fetching Places And Sub Types By Types');

        groupIdByEpidemiologyNumberLogger.info('launching groupid by epidemiologyNumber request', Severity.LOW);
        return await axios.get<string>('/investigationInfo/groupedInvestigationsId')
            .then((response) => {
                groupIdByEpidemiologyNumberLogger.info('groupid by epidemiologyNumber was successful', Severity.LOW);
                return response.data;
            })
            .catch((error) => {
                groupIdByEpidemiologyNumberLogger.info(`got errors in server result: ${error}`,Severity.HIGH);
                return '';
            });
    }

    const setGroupIdAsync = async () => {
        const groupId = await fetchGroupedId()
        setGroupId(groupId);
    }
    useEffect(() => {
        setGroupIdAsync();
    }, [])
}

interface Props {
    setGroupId : React.Dispatch<React.SetStateAction<string>>;
}

export default useGroupedInvestigationsTab;