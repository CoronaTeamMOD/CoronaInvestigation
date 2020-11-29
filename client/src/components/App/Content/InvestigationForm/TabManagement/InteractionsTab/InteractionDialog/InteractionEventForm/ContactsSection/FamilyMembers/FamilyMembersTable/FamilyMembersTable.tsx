import { format } from 'date-fns';
import React, { useMemo, useState } from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Checkbox, Typography } from '@material-ui/core';

import InvolvedContact from 'models/InvolvedContact';

import useStyles from './FamilyMembersTableStyles';
import FamilyContactsTableHeadersNames, { FamilyContactsTableHeaders } from '../../../../../FamilyContactsDialog/FamilyContactsTable/FamilyContactsTableHeaders';

const birthDateFormat = 'dd/MM/yyyy';

const FamilyMembersTable: React.FC<Props> = (props: Props) => {
    
    const { familyMembers } = props;
    const classes = useStyles();

    const [selectedFamilyMembers, setSelectedFamilyMembers] = useState<InvolvedContact[]>([]);

    const selectRow = (selectedFamilyMember: InvolvedContact) => {
        const familyMemberIndex = selectedFamilyMembers.findIndex(checkedRow => selectedFamilyMember === checkedRow);
        if (familyMemberIndex !== -1) {
            setSelectedFamilyMembers(selectedFamilyMembers.filter(member => member !== selectedFamilyMember));
            selectedFamilyMember.selected = false;
        } else {
            setSelectedFamilyMembers([...selectedFamilyMembers, selectedFamilyMember]);
            selectedFamilyMember.selected = true;
        }
    }

    const counterDescription: string = useMemo(() => {
        return selectedFamilyMembers.length > 0 ?
        selectedFamilyMembers.length === 1 ?
                'נבחר מגע משפחה אחד' :
                'בסה"כ נבחרו ' + selectedFamilyMembers.length + ' מגעי משפחה'
            : ''
    }, [selectedFamilyMembers]);

    const isRowSelected = (selectedFamilyMember: InvolvedContact) => selectedFamilyMembers?.includes(selectedFamilyMember);

    const convertToIndexedRow = (row: InvolvedContact) : IndexedContactRow => ({
        [FamilyContactsTableHeadersNames.FAMILY_RELATIONSHIP]: row.familyRelationship,
        [FamilyContactsTableHeadersNames.FIRST_NAME]: row.firstName,
        [FamilyContactsTableHeadersNames.LAST_NAME]: row.lastName,
        [FamilyContactsTableHeadersNames.IDENTIFICATION_TYPE]: row.identificationType,
        [FamilyContactsTableHeadersNames.IDENTIFICATION_NUMBER]: row.identificationNumber,
        [FamilyContactsTableHeadersNames.BIRTH_DATE]: row.birthDate,
        [FamilyContactsTableHeadersNames.PHONE_NUMBER]: row.phoneNumber,
        [FamilyContactsTableHeadersNames.ADDITIONAL_PHONE_NUMBER]: row.additionalPhoneNumber,
        [FamilyContactsTableHeadersNames.ISOLATION_CITY]: row.isolationCity
    });

    const getTableCell = (row: IndexedContactRow, cellName: string) => {
        const cellValue = row[cellName as FamilyContactsTableHeadersNames];
        if (!cellValue) return '---'; 
        switch (cellName) {
            case FamilyContactsTableHeadersNames.BIRTH_DATE: {
                return format(new Date(cellValue), birthDateFormat);
            }
            default: 
                return cellValue;
        }
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {
                                [''].concat(Object.values(FamilyContactsTableHeaders)).map(cellName => {
                                    return (
                                        <TableCell>{cellName}</TableCell>
                                    )
                                })
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            familyMembers.map(familyMember => (
                                <>
                                    <TableRow className={isRowSelected(familyMember) ? classes.checkedRow : familyMember.isContactedPerson ? classes.disabledRow : ''}>
                                        {
                                            <Checkbox disabled={familyMember.isContactedPerson} onClick={(event) => {
                                                event.stopPropagation();
                                                selectRow(familyMember);
                                            }} color='primary' checked={isRowSelected(familyMember)} />
                                        }
                                        {
                                            Object.keys(FamilyContactsTableHeaders).map(cellName => (
                                                <TableCell className={classes.cell}>{getTableCell(convertToIndexedRow(familyMember), cellName)}</TableCell>
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

export type IndexedContactRow = { [T in keyof typeof FamilyContactsTableHeaders]: any};

export default FamilyMembersTable;
