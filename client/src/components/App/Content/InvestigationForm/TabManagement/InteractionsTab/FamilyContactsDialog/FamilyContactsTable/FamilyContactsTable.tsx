import React from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';

import InvolvedContact from 'models/InvolvedContact';
import useFamilyContactsUtils from 'Utils/FamilyContactsUtils/useFamilyContactsUtils';

import useStyles from './FamilyContactsTableStyles';
import { FamilyContactsTableHeaders } from './FamilyContactsTableHeaders';

const FamilyContactsTable: React.FC<Props> = (props: Props) => {

    const { familyMembers, className } = props;

    const classes = useStyles();

    const { convertToIndexedRow, getTableCell } = useFamilyContactsUtils();

    return (
        <TableContainer className={className} component={Paper}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        {
                            Object.values(FamilyContactsTableHeaders).map(cellName => {
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
                            <TableRow>
                                {
                                    Object.keys(FamilyContactsTableHeaders).map(cellName => (
                                        <TableCell className={classes.cell}>{getTableCell(convertToIndexedRow(member), cellName)}</TableCell>
                                    ))
                                }
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
};

interface Props {
    familyMembers: InvolvedContact[];
    className: string;
};

export default FamilyContactsTable;
