import React from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody} from '@material-ui/core'; 

import InvestigationTableRow from 'models/InvestigationTableRow';
import { get } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';

import useStyles from './GroupedInvestigationsTableStyles'
import { TableHeadersNames } from '../../../InvestigationTablesHeaders'

const tableHeaders = {
    [TableHeadersNames.epidemiologyNumber]: 'מספר אפידימיולוגי',
    [TableHeadersNames.fullName]: 'שם מלא',
    [TableHeadersNames.city]: 'עיר מגורים',
    [TableHeadersNames.phoneNumber]: 'טלפון',
    [TableHeadersNames.statusReason]: 'סטטוס ביצוע'
};

const GroupedInvestigationsTable = ({ investigations }: Props) => {

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
                        investigations.map((investigationToGroup: InvestigationTableRow) => (
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
    investigations: InvestigationTableRow[];
}

export default GroupedInvestigationsTable;
