import React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableContainer from '@material-ui/core/TableContainer';

import useStyles from './InvestigationTableStyles';
import useInvestigationTable from './useInvestigationTable';

const InvestigationTable: React.FC = (): JSX.Element => {
  const classes = useStyles();
  const tableRows = useInvestigationTable().tableRows;

  return (
    <div className={classes.content}>
        <TableContainer component={Paper} className={classes.tableContainer}>
        <Table aria-label="simple table" stickyHeader id='LandingPageTable'>
            <TableHead>
            <TableRow>
                <TableCell id='epidemicNum'>מספר אפידמיולוגי</TableCell>
                <TableCell align="left" id='status'>סטטוס ביצוע</TableCell>
                <TableCell align="left" id='fullName'>שם מלא</TableCell>
                <TableCell align="left" id='phoneNum'>מספר טלפון</TableCell>
                <TableCell align="left" id='age'> גיל</TableCell>
                <TableCell align="left" id='city'>עיר מגורים</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {tableRows.map((row) => (
                <TableRow key={row.epidemiologyNum}>
                    <TableCell component="th" scope="row">
                        {row.epidemiologyNum}
                    </TableCell>
                    <TableCell align="left">{row.status}</TableCell>
                    <TableCell align="left">{row.fullName}</TableCell>
                    <TableCell align="left">{row.phoneNumber}</TableCell>
                    <TableCell align="left">{row.age}</TableCell>
                    <TableCell align="left">{row.city}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    </div>
  );
}

export default InvestigationTable;