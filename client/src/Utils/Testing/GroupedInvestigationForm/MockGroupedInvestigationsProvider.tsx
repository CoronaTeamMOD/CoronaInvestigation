import React from 'react'

import { GroupedInvestigationsContextProvider, initialContacts } from 'commons/Contexts/GroupedInvestigationFormContext';

const checkedRowValues = {
    ...initialContacts, 
    groupedInvestigationContacts : [777]
}

const MockGroupedInvestigationsProvider : React.FC<Props> = (props) => {
    return (
        <GroupedInvestigationsContextProvider value={checkedRowValues}>
            {props.children}
        </GroupedInvestigationsContextProvider>
    )
}

interface Props {
    
}

export default MockGroupedInvestigationsProvider;
