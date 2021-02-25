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
import useFamilyMemebersTable from './useFamilyMembersTable';

const houseMember = 'בן בית';
const cityCellName = 'isolationCity';

const FamilyMembersTable: React.FC<Props> = (props: Props) => {

    const { familyMembers } = props;
    const classes = useStyles();

    const { convertToIndexedRow, getTableCell } = useFamilyContactsUtils();

    const FamilyTableHeadersWithCheckbox = [''].concat(Object.values(FamilyContactsTableHeaders));

    useEffect(() => {
        familyMembers.forEach((familyMember: InvolvedContact) => {
            familyMember.selected = false;
        });
    }, []);

    const {selectRow,
        counterDescription,
        isRowSelected,
        isHouseMember } = useFamilyMemebersTable({ familyMembers });


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
                                    <TableRow className={isRowSelected(familyMember) ? classes.checkedRow  : ''}>
                                        {
                                            <Checkbox
                                                //disabled={familyMember.isContactedPerson}
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
                                                            <Home className={classes.homeIcon} />
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
