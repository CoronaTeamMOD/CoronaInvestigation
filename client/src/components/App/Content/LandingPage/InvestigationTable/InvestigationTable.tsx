import React from 'react';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import { Paper, Table, TableRow, TableBody, TableCell, Typography, TableHead, TableContainer, TextField, Button, TableSortLabel } from '@material-ui/core';

import User from 'models/User';
import Investigator from 'models/Investigator';
import StoreStateType from 'redux/storeStateType';
import InvestigationTableRow from 'models/InvestigationTableRow';

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

    type Order = 'asc' | 'desc';
    type sortableHeaders = { [T in keyof typeof TableHeadersNames]: boolean};

    const sortableCols: sortableHeaders = {
        [TableHeadersNames.epidemiologyNumber]: true,
        [TableHeadersNames.coronaTestDate]: true,
        [TableHeadersNames.priority]: false,
        [TableHeadersNames.fullName]: false,
        [TableHeadersNames.phoneNumber]: false,
        [TableHeadersNames.age]: true,
        [TableHeadersNames.city]: true,
        [TableHeadersNames.investigatorName]: true,
        [TableHeadersNames.status]: true,
    }

    const orderOptions = [
        // 'defaultOrder',
        'coronaTestDateASC',
        'coronaTestDateDESC',
        'epidemiologyNumberDESC',
        'epidemiologyNumberASC',
        'cityDESC',
        'cityASC',
        'ageDESC',
        'ageASC',
        // 'patientFullNameDESC',
        // 'patientFullNameASC',
        'investigationStatusDESC',
        'investigationStatusASC',
        'investigatorNameDESC',
        'investigatorNameASC'
      ]

    const [selectedRow, setSelectedRow] = React.useState<number>(UNDEFINED_ROW);
    const [investigator, setInvestigator] = React.useState<Investigator>(defaultInvestigator);
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<string>(TableHeadersNames.epidemiologyNumber);
    
    const {
        tableRows, onInvestigationRowClick, convertToIndexedRow,
        getMapKeyByValue, onInvestigatorChange, getTableCellStyles,
        onClickFunc
    } = useInvestigationTable({
        selectedInvestigator: investigator, setSelectedRow
    });

    const user = useSelector<StoreStateType, User>(state => state.user);

    const groupUsers = useSelector<StoreStateType, Map<string, User>>(state => state.groupUsers);

    const handleRequestSort = (event: any, property: React.SetStateAction<string>) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        onClickFunc('epidemiologyNumberDESC');
    };

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
                                        <TableCell 
                                        className={key === TableHeadersNames.investigatorName ? classes.columnBorder : ''}
                                        sortDirection={orderBy === key ? order : false}>
                                            {
                                                TableHeaders[key as keyof typeof TableHeadersNames]
                                            }
                                            {sortableCols[key as keyof typeof TableHeadersNames] && <TableSortLabel 
                                                active
                                                direction={orderBy === key ? order : 'asc'}
                                                onClick={(e)=>handleRequestSort(e,key)}>
                                            </TableSortLabel>}
                                        </TableCell>
                                    ))
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableRows.map((row: InvestigationTableRow, index: number) => {
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
                                            Object.values(user.isAdmin ? adminCols : userCols).map((key: string) => (
                                                <TableCell
                                                    className={getTableCellStyles(index, key).join(' ')}
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
                                                                    onInvestigatorChange(indexedRow, newSelectedInvestigator, indexedRow.investigatorName)
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
