import React from 'react'

import useGroupedInvestigationsTab from './useGroupedInvestigationForm';

interface Props {
    groupId : string;
}

const GroupedInvestigationForm = (props: Props) => {
    const { groupId } = props;
    useGroupedInvestigationsTab({groupId});
    return (
        <div>
            
        </div>
    )
}

export default GroupedInvestigationForm
