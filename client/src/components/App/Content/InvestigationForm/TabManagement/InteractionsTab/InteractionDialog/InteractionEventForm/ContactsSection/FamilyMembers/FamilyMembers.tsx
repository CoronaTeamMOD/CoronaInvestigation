import React, { useContext } from 'react';
import { Typography } from '@material-ui/core';

import { familyMembersContext } from 'commons/Contexts/FamilyMembersContext';

import FamilyMembersTable from './FamilyMembersTable/FamilyMembersTable';

const noFamilyMembers = 'לא קיימים נתונים ממרשם האוכלוסין';

const FamilyMembers: React.FC = () => {

    const { familyMembers } = useContext(familyMembersContext);

    return (
        familyMembers.length > 0 ?
            <FamilyMembersTable
                familyMembers={familyMembers}
            />
            :
            <Typography variant='h5'>{noFamilyMembers}</Typography>
    );
};

export default FamilyMembers;
