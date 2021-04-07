import axios from 'axios';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';

import { setGroupId , setGroupedInvestigations } from 'redux/GroupedInvestigations/GroupedInvestigationsCreators'
import ConnectedInvestigationContact from 'models/GroupedInvestigationContacts/ConnectedInvestigationContact';

const useGroupedInvestigationContacts = () => {
    const fetchGroupedId = async () => {
        const groupIdByEpidemiologyNumberLogger = logger.setup('Fetching Investigation Group Id');

        groupIdByEpidemiologyNumberLogger.info('launching groupid by epidemiologyNumber request', Severity.LOW);
        return await axios.get<string>('/investigationInfo/groupedInvestigationsId')
            .then((response) => {
                groupIdByEpidemiologyNumberLogger.info('groupid by epidemiologyNumber was successful', Severity.LOW);
                return response.data;
            })
            .catch((error) => {
                groupIdByEpidemiologyNumberLogger.error(`got errors in server result: ${error}`,Severity.HIGH);
                return '';
            });
    }

    const fetchGroupedInvestigationContacts = (groupId : string) => {
        const connectedInvestigationsByGroupIdLogger = logger.setup('Fetching Grouped Investigations Contacts');
        
        connectedInvestigationsByGroupIdLogger.info('launching connectedInvestigationContacts by groupId request', Severity.LOW);
        return axios.get<ConnectedInvestigationContact>(`/intersections/groupedInvestigationsContacts/${groupId}`)
            .then((response) => {
                connectedInvestigationsByGroupIdLogger.info('connectedInvestigationContacts by groupId was successful', Severity.LOW);
                return response.data;
            })
            .catch((error) => {
                connectedInvestigationsByGroupIdLogger.error(`got errors in server result: ${error}`,Severity.HIGH);
                return {
                    investigationGroupReasonByReason: {
                        id: -1,
                        displayName : 'חלה שגיאה בשליפת הנתונים מהשרת'
                    },
                    investigationsByGroupId: {
                        nodes : []
                    }
                }
            })
    }

    const setGroupedInvestigationsDetailsAsync = async () => {
        const groupId = await fetchGroupedId();
        setGroupId(groupId);
        if(groupId) {
            const investigations = await fetchGroupedInvestigationContacts(groupId);
            setGroupedInvestigations(investigations);
        }
    }

    return {
        setGroupedInvestigationsDetailsAsync
    }
}

export default useGroupedInvestigationContacts;