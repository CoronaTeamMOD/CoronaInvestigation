import React, { useState } from 'react'

import useStyles from './groupedInvestigationFormStyles'; 
import NotGroupedMessage from './NotGroupedMessage/NotGroupedMessage';
import useGroupedInvestigationsTab from './useGroupedInvestigationsTab';
import GroupedInvestigationForm from './GroupedInvestigationForm/GroupedInvestigationForm';

const GroupedInvestigationsTab = (props: Props) => {
    const { groupedInvestigationContacts, setGroupedInvestigationContacts} = props;
    const classes = useStyles();
    const [groupId, setGroupId] = useState<string>("");
    useGroupedInvestigationsTab({setGroupId});

    return (
        <div className={classes.wrapper}>
            {groupId === ""
                ?   <NotGroupedMessage />
                :   <GroupedInvestigationForm 
                        groupId={groupId}
                        groupedInvestigationContacts={groupedInvestigationContacts}
                        setGroupedInvestigationContacts={setGroupedInvestigationContacts}
                    />
                }
        </div>
    )
}

interface Props {
    groupedInvestigationContacts: number[]; 
    setGroupedInvestigationContacts:  React.Dispatch<React.SetStateAction<number[]>>;
}

export default GroupedInvestigationsTab;
