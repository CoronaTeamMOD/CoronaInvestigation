import axios from 'axios';
import { useEffect } from 'react';

import ConnectedInvestigationContact from './ConnectedInvestigationContact';

const useGroupedInvestigationForm = (props : Props) => {
    const { groupId, setContacts } = props;

    const fetchGroupedInvestigationContacts = () => {
        return axios.get<ConnectedInvestigationContact>(`/intersections/groupedInvestigationsContacts/${groupId}`)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                return {
                    investigationGroupReasonByReason: {
                        displayName : "טוען..."
                    },
                    nodes : []
                }
            })
    }

    const setGroupedInvestigationContactsAsync = async () => {
        const contacts = await fetchGroupedInvestigationContacts();
        setContacts(contacts);
    }
    
    useEffect(() => {
        setGroupedInvestigationContactsAsync();
    }, [])
}

interface Props {
    groupId : string;
    setContacts : React.Dispatch<React.SetStateAction<ConnectedInvestigationContact>>
}

export default useGroupedInvestigationForm;
