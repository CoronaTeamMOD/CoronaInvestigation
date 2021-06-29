import { useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';

import StoreStateType from 'redux/storeStateType';
import InvolvedContact from 'models/InvolvedContact';
import FlattenedDBAddress, { DBAddress } from 'models/DBAddress';

import useStyles from './FamilyMembersTableStyles';

const useFamilyMemebersTable = (parameters: Parameters) => {
    const { familyMembers, existingFamilyMembers, eventContactIds } = parameters;

    const classes = useStyles();

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

    const isRowDisabled = (identificationNumber: string) => {
       return existingFamilyMembers.indexOf(identificationNumber) !== -1 || eventContactIds?.indexOf(identificationNumber) !== -1; 
    };

    const generateRulerBorderColorClass = (colorCode: Number | any) => {
        switch (colorCode) {
            case '1':
                return classes.red;
            case '2':
                return classes.orange;
            case '3':
                return classes.green;
            case '4':
                return classes.yellow;
            default:
                return classes.white;
        }
    }

    const getRowClass = (familyMember: InvolvedContact) => {
        if(isRowDisabled(familyMember.identificationNumber)) {
            return classes.disabledRow;
        } else if (isRowSelected(familyMember)) {
            return classes.checkedRow;
        }
        return '';
    };

    const getRulerBorderClass = (colorCode: String | undefined) => {
        return generateRulerBorderColorClass(colorCode)
    };

    return {
        selectRow,
        counterDescription,
        isRowSelected,
        isHouseMember,
        isRowDisabled,
        getRowClass,
        getRulerBorderClass
    };
};

interface Parameters {
    familyMembers: InvolvedContact[];
    existingFamilyMembers: string[];
    eventContactIds?: (string | undefined)[]; 
};

export default useFamilyMemebersTable;