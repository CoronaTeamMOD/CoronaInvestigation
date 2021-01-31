import { useContext } from 'react';

import { groupedInvestigationsContext } from 'commons/Contexts/GroupedInvestigationFormContext';

const useTableRows = () => {
    const groupedInvestigationsContextState = useContext(groupedInvestigationsContext);
    const handleCheckboxToggle = (id : number) => {
        const rowIndex = groupedInvestigationsContextState.groupedInvestigationContacts.indexOf(id);
        if(rowIndex === -1) {
            groupedInvestigationsContextState.setGroupedInvestigationContacts([...groupedInvestigationsContextState.groupedInvestigationContacts , id]);
        } else {
            groupedInvestigationsContextState.setGroupedInvestigationContacts(groupedInvestigationsContextState.groupedInvestigationContacts.filter(row => row !== id));
        }
    }

    return {
        handleCheckboxToggle
    }
}


export default useTableRows;