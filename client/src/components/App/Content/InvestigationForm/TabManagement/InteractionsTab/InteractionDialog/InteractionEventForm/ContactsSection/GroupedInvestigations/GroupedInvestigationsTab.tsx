import React, { useState } from 'react'

import NotGroupedMessage from './NotGroupedMessage/NotGroupedMessage';
import useGroupedInvestigationsTab from './useGroupedInvestigationsTab';
import GroupedInvestigationForm from './GroupedInvestigationForm/GroupedInvestigationForm';
interface Props {
    
}

const GroupedInvestigationsTab = (props: Props) => {
    const [groupId, setGroupId] = useState<string>("");
    useGroupedInvestigationsTab({setGroupId});

    return (
        groupId === ""
            ? <NotGroupedMessage />
            : <GroupedInvestigationForm groupId={groupId}/>
            
    )
}

export default GroupedInvestigationsTab;
