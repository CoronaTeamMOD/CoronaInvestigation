import React, { useState } from 'react'

import useStyles from './groupedInvestigationFormStyles'; 
import NotGroupedMessage from './NotGroupedMessage/NotGroupedMessage';
import useGroupedInvestigationsTab from './useGroupedInvestigationsTab';
import GroupedInvestigationForm from './GroupedInvestigationForm/GroupedInvestigationForm';
interface Props {
    
}

const GroupedInvestigationsTab = (props: Props) => {
    const classes = useStyles();
    const [groupId, setGroupId] = useState<string>("");
    useGroupedInvestigationsTab({setGroupId});

    return (
        <div className={classes.wrapper}>
            {groupId === ""
                ? <NotGroupedMessage />
                : <GroupedInvestigationForm groupId={groupId}/>}
        </div>
    )
}

export default GroupedInvestigationsTab;
