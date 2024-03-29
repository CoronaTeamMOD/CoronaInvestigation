import React, { useContext, useEffect } from 'react';
import { Home } from '@material-ui/icons';
import InfoIcon from '@material-ui/icons/Info';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Checkbox, Typography, Tooltip } from '@material-ui/core';

import InvolvedContact from 'models/InvolvedContact';
import useFamilyContactsUtils from 'Utils/FamilyContactsUtils/useFamilyContactsUtils';
import { groupedInvestigationsContext } from 'commons/Contexts/GroupedInvestigationFormContext';
import { FamilyContactsTableHeaders } from 'Utils/FamilyContactsUtils/FamilyContactsTableHeaders';

import useStyles from './FamilyMembersTableStyles';
import useFamilyMemebersTable from './useFamilyMembersTable';

const houseMember = 'בן בית';
const cityCellName = 'isolationCity';
const finalEpidemiologicalStatusDescCellName = 'finalEpidemiologicalStatusDesc'

const FamilyMembersTable: React.FC<Props> = (props: Props) => {
    const { eventContactIds } = useContext(groupedInvestigationsContext);

    const { familyMembers, existingFamilyMembers } = props;

    const classes = useStyles();

    const { convertToIndexedRow, getTableCell } = useFamilyContactsUtils();

    const FamilyTableHeadersWithCheckbox = [''].concat(Object.values(FamilyContactsTableHeaders));

    useEffect(() => {
        familyMembers.forEach((familyMember: InvolvedContact) => {
            familyMember.selected = false;
        });
    }, []);

    const { selectRow, counterDescription, isRowSelected, 
            isHouseMember, isRowDisabled, getRowClass, getRulerColorClass 
    } = useFamilyMemebersTable({ familyMembers, existingFamilyMembers, eventContactIds });

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {
                                FamilyTableHeadersWithCheckbox.map(cellName => {
                                    return (
                                        <TableCell key={cellName}>{cellName}</TableCell>
                                    )
                                })
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            familyMembers.map((familyMember: InvolvedContact) => (
                                <>
                                    <TableRow key={familyMember.id} className={getRowClass(familyMember)}>
                                        {
                                            <Checkbox
                                                disabled={isRowDisabled(familyMember.identificationNumber)}
                                                onClick={() => selectRow(familyMember)}
                                                color='primary'
                                                checked={isRowSelected(familyMember)}
                                            />
                                        }
                                        {
                                            Object.keys(FamilyContactsTableHeaders).map(cellName => (
                                                <TableCell key={cellName} className={classes.cell}>{getTableCell(convertToIndexedRow(familyMember), cellName)}
                                                    {
                                                        cellName === cityCellName && isHouseMember(familyMember.isolationAddress) &&
                                                        <Tooltip title={houseMember}>
                                                            <Home className={classes.homeIcon} />
                                                        </Tooltip>
                                                    }
                                                    {
                                                        cellName === finalEpidemiologicalStatusDescCellName && familyMember.finalEpidemiologicalStatusDesc  &&
                                                        <InfoIcon className={getRulerColorClass(familyMember?.colorCode)} />
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
    existingFamilyMembers: string[];
};

export default FamilyMembersTable;