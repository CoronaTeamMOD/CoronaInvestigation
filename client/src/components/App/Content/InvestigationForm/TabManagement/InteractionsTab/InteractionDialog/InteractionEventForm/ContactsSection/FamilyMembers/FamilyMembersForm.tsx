import React from 'react';
import { Typography } from '@material-ui/core';

import useFamilyMemebersForm from './useFamilyMembersForm';
import FamilyMembersTable from './FamilyMembersTable/FamilyMembersTable';

const noFamilyMembers = 'לא קיימים נתונים ממרשם האוכלוסין';

const FamilyMembersForm: React.FC<Props> = (props) => {
    const { familyMembers, existingFamilyMembers } = useFamilyMemebersForm();

    return (
        familyMembers.length > 0 ?
            <FamilyMembersTable
                familyMembers={familyMembers}
                existingFamilyMembers={existingFamilyMembers}
            />
            :
            <Typography variant='h5'>{noFamilyMembers}</Typography>
    );
};

interface Props {

};

export default FamilyMembersForm;
