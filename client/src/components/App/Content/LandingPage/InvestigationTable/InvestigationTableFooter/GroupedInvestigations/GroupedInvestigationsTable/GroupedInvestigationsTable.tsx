import React from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody} from '@material-ui/core'; 

import InvestigationTableRow from 'models/InvestigationTableRow';
import { get } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';

import { TableHeadersNames } from '../../../InvestigationTablesHeaders'
import useStyles from './GroupedInvestigationsTableStyles'

const tableHeaders = {
    [TableHeadersNames.epidemiologyNumber]: 'מספר אפידימיולוגי',
    [TableHeadersNames.fullName]: 'שם מלא',
    [TableHeadersNames.city]: 'עיר מגורים',
    [TableHeadersNames.phoneNumber]: 'טלפון',
    [TableHeadersNames.statusReason]: 'סטטוס ביצוע'
};

const GroupedInvestigationsTable = ({ invetigationsToGroup }: Props) => {

    const classes = useStyles();

    return (
        <TableContainer component={Paper} className={classes.container}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        {
                            Object.values(tableHeaders).map((cellName: string) => {
                                return (
                                    <TableCell>
                                        <b>{cellName}</b>
                                    </TableCell>
                                )
                            })
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        invetigationsToGroup.map((investigationToGroup: InvestigationTableRow) => (
                            <TableRow>
                                {
                                    Object.keys(tableHeaders).map((cellHeader: string) => (
                                        <TableCell>
                                            {
                                                get(investigationToGroup, cellHeader)
                                            }
                                        </TableCell>
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
    invetigationsToGroup: InvestigationTableRow[];
}

export default GroupedInvestigationsTable;
