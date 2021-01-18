import React, { useState } from 'react'

import useGroupedInvestigationsTab from './useGroupedInvestigationsTab';
import NotGroupedMessage from './NotGroupedMessage/NotGroupedMessage'
interface Props {
    
}

const GroupedInvestigationsTab = (props: Props) => {
    const [groupId, setGroupId] = useState<string>("");
    useGroupedInvestigationsTab({setGroupId});

    return (
        groupId === ""
            ? <NotGroupedMessage />
            : <div>helo</div>
            
    )
}

export default GroupedInvestigationsTab;
