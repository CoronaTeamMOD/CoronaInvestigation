import React from 'react';
import {
    Paper, Table, TableRow, TableBody,
    TableCell, Typography, TableHead, TableContainer
} from '@material-ui/core';

import useStyles from './InvestigationTableStyles';
import useInvestigationTable from './useInvestigationTable';

const welcomeMessage = 'היי, אלו הן החקירות שהוקצו לך היום. בואו נקטע את שרשראות ההדבקה!';
const noInvestigationsMessage = 'היי,אין חקירות לביצוע!';

const InvestigationTable: React.FC = (): JSX.Element => {

    const classes = useStyles();
    const { tableRows, onInvestigationRowClick } = useInvestigationTable();

    return (
        <>
            <Typography color="textPrimary" className={classes.welcomeMessage}>
                {tableRows.length === 0 ? noInvestigationsMessage : welcomeMessage}
            </Typography>
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
                                <TableRow
                                    key={row.epidemiologyNumber}
                                    className={classes.investigationRow}
                                    onClick={() => {
                                        onInvestigationRowClick(row.epidemiologyNumber, row.status)
                                    }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.epidemiologyNumber}
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
        </>
    );
}

export default InvestigationTable;