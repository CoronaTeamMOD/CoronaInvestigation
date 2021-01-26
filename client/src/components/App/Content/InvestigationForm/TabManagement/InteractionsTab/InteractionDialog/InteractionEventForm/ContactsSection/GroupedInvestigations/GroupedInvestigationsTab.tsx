import React, { useState } from 'react'

import { IdToCheck } from 'Utils/Contacts/useDuplicateContactId';

import useStyles from './groupedInvestigationFormStyles'; 
import ErrorMessage from './ErrorMessage/ErrorMessage';
import useGroupedInvestigationsTab from './useGroupedInvestigationsTab';
import GroupedInvestigationForm from './GroupedInvestigationForm/GroupedInvestigationForm';

const notGroupedText = 'החקירה אינה מקובצת';

const GroupedInvestigationsTab = (props: Props) => {
    const { groupedInvestigationContacts, setGroupedInvestigationContacts , allContactIds} = props;
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
                        allContactIds={allContactIds}
                    />
                }
        </div>
    )
}

interface Props {
    groupedInvestigationContacts: number[]; 
    setGroupedInvestigationContacts:  React.Dispatch<React.SetStateAction<number[]>>;
    allContactIds: IdToCheck[];
}

export default GroupedInvestigationsTab;
