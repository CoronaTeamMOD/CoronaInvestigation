import { useContext } from 'react';

import { familyMembersContext } from 'commons/Contexts/FamilyMembersContext';

const useFamilyMemebersForm = () => {

    const { familyMembers, eventFamilyMembersIds } = useContext(familyMembersContext);

    const existingFamilyMembers = eventFamilyMembersIds 
        ? eventFamilyMembersIds.map(identificationNumber => {
            if(identificationNumber) { 
                return identificationNumber;
            }
            return '';
        })
        : [];

    return {
        familyMembers,
        existingFamilyMembers
    };
};

export default useFamilyMemebersForm;