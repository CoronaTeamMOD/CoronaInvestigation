import React, { useContext } from 'react';
import { Typography } from '@material-ui/core';

import { familyMembersContext } from 'commons/Contexts/FamilyMembersContext';

import FamilyContactsTable from '../../../../FamilyContactsDialog/FamilyContactsTable/FamilyContactsTable';

const noFamilyMembers = 'לא קיימים נתונים ממרשם האוכלוסין';

const FamilyMembers: React.FC = () => {
    const { familyMembers } = useContext(familyMembersContext);

    return (
        familyMembers.length > 0 ?
            <FamilyContactsTable
                familyMembers={familyMembers}
                showCheckBoxes={true}
            />
            :
            <Typography variant='h5'>{noFamilyMembers}</Typography>
    );
};

export default FamilyMembers;
