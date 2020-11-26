import { format } from 'date-fns';
import React, { useMemo, useState } from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Checkbox, Typography } from '@material-ui/core';

import InvolvedContact from 'models/InvolvedContact';

import useStyles from './FamilyContactsTableStyles';
import FamilyContactsTableHeadersNames, { FamilyContactsTableHeaders } from './FamilyContactsTableHeaders';

const birthDateFormat = 'dd/MM/yyyy';

const FamilyContactsTable: React.FC<Props> = (props: Props) => {

    const { familyMembers, className, showCheckBoxes } = props;

    const [checkedRowsIds, setCheckedRowsIds] = useState<string[]>([]);

    const selectRow = (identificationNumber: string) => {
        const identificationNumberIndex = checkedRowsIds.findIndex(checkedRow => identificationNumber === checkedRow);
        if (identificationNumberIndex !== -1) {
            setCheckedRowsIds(checkedRowsIds.filter(rowId => rowId !== identificationNumber));
        } else {
            setCheckedRowsIds([...checkedRowsIds, identificationNumber]);
        }
    }

    const counterDescription: string = useMemo(() => {
        return checkedRowsIds.length > 0 ?
            checkedRowsIds.length === 1 ?
                'נבחר מגע משפחה אחד' :
                'בסה"כ נבחרו ' + checkedRowsIds.length + ' מגעי משפחה'
            : ''
    }, [checkedRowsIds]);

    const isRowSelected = (identificationNumber: string) => checkedRowsIds.includes(identificationNumber);

    const classes = useStyles();

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
    })

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
            <TableContainer className={className} component={Paper}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {
                                showCheckBoxes ?
                                    [''].concat(Object.values(FamilyContactsTableHeaders)).map(cellName => {
                                        return (
                                            <TableCell>{cellName}</TableCell>
                                        )
                                    })
                                    : (Object.values(FamilyContactsTableHeaders)).map(cellName => {
                                        return (
                                            <TableCell>{cellName}</TableCell>
                                        )
                                    })
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            familyMembers.map(member => (
                                <>
                                    <TableRow className={isRowSelected(member.identificationNumber) ? classes.checkedRow : ''}>
                                        {
                                            showCheckBoxes &&
                                            <Checkbox onClick={(event) => {
                                                event.stopPropagation();
                                                selectRow(member.identificationNumber);
                                            }} color='primary' checked={isRowSelected(member.identificationNumber)} />
                                        }
                                        {
                                            Object.keys(FamilyContactsTableHeaders).map(cellName => (
                                                <TableCell className={classes.cell}>{getTableCell(convertToIndexedRow(member), cellName)}</TableCell>
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
    className?: string;
    showCheckBoxes?: boolean;
};

export type IndexedContactRow = { [T in keyof typeof FamilyContactsTableHeaders]: any};

export default FamilyContactsTable;
