import { useContext } from 'react';

import { groupedInvestigationsContext } from 'commons/Contexts/GroupedInvestigationFormContext';

const useTableRows = () => {
    const {groupedInvestigationContacts , setGroupedInvestigationContacts} = useContext(groupedInvestigationsContext);
    const handleCheckboxToggle = (id : number) => {
        const rowIndex = groupedInvestigationContacts.indexOf(id);
        if(rowIndex === -1) {
            setGroupedInvestigationContacts([...groupedInvestigationContacts , id]);
        } else {
            setGroupedInvestigationContacts(groupedInvestigationContacts.filter(row => row !== id));
        }
    }

    return {
        handleCheckboxToggle
    }
}


export default useTableRows;