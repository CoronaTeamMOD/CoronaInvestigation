import axios from 'axios';
import { useEffect } from 'react';

const useGroupedInvestigationForm = (props : Props) => {
    const { groupId } = props;

    const fetchGroupedInvestigationContacts = () => {
        axios.get(`/intersections/groupedInvestigationsContacts/${groupId}`)
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            })
    }
    
    useEffect(() => {
        fetchGroupedInvestigationContacts();
    }, [])

}

interface Props {
    groupId : string;
}

export default useGroupedInvestigationForm;
