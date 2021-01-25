import React, { useState } from 'react'

import useStyles from './groupedInvestigationFormStyles'; 
import ErrorMessage from './ErrorMessage/ErrorMessage';
import useGroupedInvestigationsTab from './useGroupedInvestigationsTab';
import GroupedInvestigationForm from './GroupedInvestigationForm/GroupedInvestigationForm';

const notGroupedText = 'החקירה אינה מקובצת';

const GroupedInvestigationsTab = (props: Props) => {
    const { groupedInvestigationContacts, setGroupedInvestigationContacts} = props;
    const classes = useStyles();
    const [groupId, setGroupId] = useState<string>("");
    useGroupedInvestigationsTab({setGroupId});

    return (
        <div className={classes.wrapper}>
            {groupId === ""
                ?   <ErrorMessage 
                        text={notGroupedText}
                    />
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
