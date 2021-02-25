import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import StoreStateType from 'redux/storeStateType';
import InvolvedContact from 'models/InvolvedContact';
import FlattenedDBAddress, { DBAddress } from 'models/DBAddress';

const useFamilyMemebersTable = (props: any): any => {
    const { familyMembers } = props;


    const investigatedPatientAddress = useSelector<StoreStateType, FlattenedDBAddress>(state => state.address);

    const [selectedFamilyMembers, setSelectedFamilyMembers] = useState<InvolvedContact[]>([]);

    useEffect(() => {
        familyMembers.forEach((familyMember: InvolvedContact) => {
            familyMember.selected = false;
        });
    }, []);

    const selectRow = (selectedFamilyMember: InvolvedContact) => {
        const familyMemberIndex = selectedFamilyMembers.findIndex(checkedRow => selectedFamilyMember === checkedRow);
        if (familyMemberIndex !== -1) {
            setSelectedFamilyMembers(selectedFamilyMembers.filter(member => member !== selectedFamilyMember));
            selectedFamilyMember.selected = false;
        } else {
            setSelectedFamilyMembers([...selectedFamilyMembers, selectedFamilyMember]);
            selectedFamilyMember.selected = true;
        }
    };

    const counterDescription: string = useMemo(() => {
        return selectedFamilyMembers.length > 0 ?
            selectedFamilyMembers.length === 1 ?
                'נבחר מגע משפחה אחד' :
                'בסה"כ נבחרו ' + selectedFamilyMembers.length + ' מגעי משפחה'
            : ''
    }, [selectedFamilyMembers]);

    const isRowSelected = (selectedFamilyMember: InvolvedContact) => selectedFamilyMembers?.includes(selectedFamilyMember);

    const isHouseMember = (familyMemberAddress: DBAddress) => (
        familyMemberAddress?.city?.id === investigatedPatientAddress.city &&
        familyMemberAddress?.street?.id === investigatedPatientAddress.street
    );


    return {
        selectRow,
        counterDescription,
        isRowSelected,
        isHouseMember
    }
};

export default useFamilyMemebersTable;