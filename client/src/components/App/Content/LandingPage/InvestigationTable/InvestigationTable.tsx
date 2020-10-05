import React from 'react';
import { useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import { Paper, Table, TableRow, TableBody, TableCell, Typography, TableHead, TableContainer, TextField } from '@material-ui/core';

import User from 'models/User';
import Investigator from 'models/Investigator';
import StoreStateType from 'redux/storeStateType';

import useStyles from './InvestigationTableStyles';
import useInvestigationTable, { UNDEFINED_ROW } from './useInvestigationTable';
import { TableHeadersNames, TableHeaders, adminCols, userCols } from './InvestigationTablesHeaders';

const welcomeMessage = 'היי, אלו הן החקירות שהוקצו לך היום. בואו נקטע את שרשראות ההדבקה!';
const noInvestigationsMessage = 'היי,אין חקירות לביצוע!';

const defaultInvestigator = {
    id: '',
    userName: ''
};

const InvestigationTable: React.FC = (): JSX.Element => {

    const classes = useStyles();

    const [selectedRow, setSelectedRow] = React.useState<number>(UNDEFINED_ROW);
    const [investigator, setInvestigator] = React.useState<Investigator>(defaultInvestigator);

    const { 
        tableRows, onInvestigationRowClick, convertToIndexedRow, 
        getMapKeyByValue, onInvestigatorChange
    } = useInvestigationTable({
        selectedInvestigator: investigator, setSelectedRow
    });

    const user = useSelector<StoreStateType, User>(state => state.user);

    const groupUsers = useSelector<StoreStateType, Map<string, User>>(state => state.groupUsers);

    return (
        <>
            <Typography color='textPrimary' className={classes.welcomeMessage}>
                {tableRows.length === 0 ? noInvestigationsMessage : welcomeMessage}
            </Typography>
            <div className={classes.content}>
                <TableContainer component={Paper} className={classes.tableContainer}>
                    <Table aria-label='simple table' stickyHeader id='LandingPageTable'>
                        <TableHead>
                            <TableRow>
                                {
                                    Object.values(user.isAdmin ? adminCols : userCols).map((key) => (
                                        <TableCell className={key === TableHeadersNames.investigatorName ? classes.columnBorder : ''}>
                                            {
                                                TableHeaders[key as keyof typeof TableHeadersNames]
                                            }
                                        </TableCell>
                                    ))
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableRows.map((row) => {
                                const indexedRow = convertToIndexedRow(row);
                                return (
                                    <TableRow
                                        key={indexedRow.epidemiologyNumber}
                                        className={classes.investigationRow}
                                        onClick={() => {
                                            onInvestigationRowClick(indexedRow.epidemiologyNumber, indexedRow.status)
                                        }}
                                    >
                                        {
                                            Object.values(user.isAdmin ? adminCols : userCols).map((key) => (
                                                <TableCell
                                                    className={key === TableHeadersNames.investigatorName ? classes.columnBorder : ''}
                                                    onClick={(event: any) => {
                                                        if (key === TableHeadersNames.investigatorName) {
                                                            event.stopPropagation();
                                                            setSelectedRow(indexedRow.epidemiologyNumber);
                                                        }
                                                    }}
                                                >
                                                    {
                                                        key === TableHeadersNames.investigatorName && selectedRow === indexedRow.epidemiologyNumber ?
                                                            <Autocomplete
                                                                test-id='currentInvetigationUser'
                                                                options={Array.from(groupUsers, ([id, value]) => ({ id, value }))}
                                                                getOptionLabel={(option) => option.value.userName}
                                                                inputValue={investigator.userName}
                                                                onChange={(event, newSelectedInvestigator) => 
                                                                    onInvestigatorChange(indexedRow,newSelectedInvestigator, indexedRow.investigatorName)
                                                                }
                                                                onInputChange={(event, selectedInvestigatorName) => {
                                                                    const updatedInvestigator = {
                                                                        id: getMapKeyByValue(groupUsers, selectedInvestigatorName),
                                                                        userName: selectedInvestigatorName
                                                                    }
                                                                    setInvestigator(updatedInvestigator);
                                                                }}
                                                                renderInput={(params) =>
                                                                    <TextField
                                                                        {...params}
                                                                        placeholder='חוקר'
                                                                    />
                                                                }
                                                            />
                                                            :
                                                            indexedRow[key as keyof typeof TableHeadersNames]
                                                    }
                                                </TableCell>
                                            ))
                                        }
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
}

export default InvestigationTable;
