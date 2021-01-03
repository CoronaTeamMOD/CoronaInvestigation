import { Home } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';
import React, { useEffect, useMemo, useState } from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Checkbox, Typography, Tooltip } from '@material-ui/core';

import InvolvedContact from 'models/InvolvedContact';
import FlattenedDBAddress, { DBAddress } from 'models/DBAddress';
import useFamilyContactsUtils from 'Utils/FamilyContactsUtils/useFamilyContactsUtils';
import { FamilyContactsTableHeaders } from 'Utils/FamilyContactsUtils/FamilyContactsTableHeaders';

import useStyles from './FamilyMembersTableStyles';

const houseMember = 'בן בית';
const cityCellName = 'isolationCity';

const FamilyMembersTable: React.FC<Props> = (props: Props) => {

    const { familyMembers } = props;
    const classes = useStyles();

    const { convertToIndexedRow, getTableCell } = useFamilyContactsUtils();

    const investigatedPatientAddress = useSelector<StoreStateType, FlattenedDBAddress>(state => state.address);

    const [selectedFamilyMembers, setSelectedFamilyMembers] = useState<InvolvedContact[]>([]);

    const FamilyTableHeadersWithCheckbox = [''].concat(Object.values(FamilyContactsTableHeaders));

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
        familyMemberAddress?.city?.id === investigatedPatientAddress.city
        && familyMemberAddress?.street?.id === investigatedPatientAddress.street
    );

    return (
        <>
            <TableContainer component={Paper}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {
                                FamilyTableHeadersWithCheckbox.map(cellName => {
                                    return (
                                        <TableCell>{cellName}</TableCell>
                                    )
                                })
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            familyMembers.map((familyMember: InvolvedContact) => (
                                <>
                                    <TableRow className={isRowSelected(familyMember) ? classes.checkedRow : familyMember.isContactedPerson ? classes.disabledRow : ''}>
                                        {
                                            <Checkbox
                                                disabled={familyMember.isContactedPerson}
                                                onClick={() => selectRow(familyMember)}
                                                color='primary'
                                                checked={isRowSelected(familyMember)}
                                            />
                                        }
                                        {
                                            Object.keys(FamilyContactsTableHeaders).map(cellName => (
                                                <TableCell className={classes.cell}>{getTableCell(convertToIndexedRow(familyMember), cellName)}
                                                    {
                                                        cellName === cityCellName && isHouseMember(familyMember.isolationAddress) &&
                                                        <Tooltip title={houseMember}>
                                                            <Home />
                                                        </Tooltip>
                                                    }
                                                </TableCell>
                                            ))
                                        }
                                    </TableRow>
                                </>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <Typography><b>{counterDescription}</b></Typography>
        </>
    );
};

interface Props {
    familyMembers: InvolvedContact[];
};

export default FamilyMembersTable;
