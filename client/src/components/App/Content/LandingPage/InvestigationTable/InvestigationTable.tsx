import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import {
    Paper, Table, TableRow, TableBody, TableCell, Typography,
    TableHead, TableContainer, TextField, TableSortLabel, Button, Popper
} from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';

import User from 'models/User';
import County from 'models/County';
import userType from 'models/enums/userType';
import Investigator from 'models/Investigator';
import StoreStateType from 'redux/storeStateType';
import InvestigationTableRow from 'models/InvestigationTableRow';

import useStyles from './InvestigationTableStyles';
import useInvestigationTable, { UNDEFINED_ROW } from './useInvestigationTable';
import { TableHeadersNames, TableHeaders, adminCols, userCols, Order, sortableCols, sortOrders } from './InvestigationTablesHeaders';

export const defaultOrderBy = 'defaultOrder';
const resetSortButtonText = 'סידור לפי תעדוף';
const welcomeMessage = 'היי, אלו הן החקירות שהוקצו לך היום. בואו נקטע את שרשראות ההדבקה!';
const noInvestigationsMessage = 'היי,אין חקירות לביצוע!';
const investigatorNameMsg = 'שם חוקר';
const newInvestigationsMsg = 'חקירות חדשות';
const activeInvestigationsMsg = 'חקירות בטיפול';

const defaultInvestigator = {
    id: '',
    countyId: 0,
    userName: ''
};

const defaultCounty = {
    id: 0,
    displayName: ''
}

const InvestigationTable: React.FC = (): JSX.Element => {

    const classes = useStyles();

    const [selectedRow, setSelectedRow] = useState<number>(UNDEFINED_ROW);
    const [selectedInvestigator, setSelectedInvestigator] = useState<Investigator>(defaultInvestigator);
    const [investigatorAutoCompleteClicked, setInvestigatorAutoCompleteClicked] = useState<boolean>(false);
    const [countyAutoCompleteClicked, setCountyAutoCompleteClicked] = useState<boolean>(false);
    const [currCounty, setCurrCounty] = useState<County>(defaultCounty);
    const [allUsersOfCurrCounty, setAllUsersOfCurrCounty] = useState<Map<string, User>>(new Map());
    const [allCounties, setAllCounties] = useState<Map<number, County>>(new Map());
    const [order, setOrder] = useState<Order>(sortOrders.asc);
    const [orderBy, setOrderBy] = useState<string>(defaultOrderBy);

    useEffect(() => {
        if (investigatorAutoCompleteClicked && countyAutoCompleteClicked) {
            setInvestigatorAutoCompleteClicked(false);
        }
    }, [countyAutoCompleteClicked]);

    useEffect(() => {
        if (countyAutoCompleteClicked && investigatorAutoCompleteClicked) {
            setCountyAutoCompleteClicked(false);
        }
    }, [investigatorAutoCompleteClicked]);

    const {
        tableRows, onInvestigationRowClick, convertToIndexedRow, getCountyMapKeyByValue,
        sortInvestigationTable, getUserMapKeyByValue, onInvestigatorChange, onCountyChange, getTableCellStyles
    } = useInvestigationTable({ selectedInvestigator, setSelectedRow, setAllUsersOfCurrCounty, setAllCounties });

    const user = useSelector<StoreStateType, User>(state => state.user);

    const CustomPopper = (props: any) => {
        return (<Popper {...props} className={classes.popperStyle} placement='bottom-start' />)
    }

    const getTableCell = (cellName: string, indexedRow: { [T in keyof typeof TableHeadersNames]: any }) => {
        switch (cellName) {
            case TableHeadersNames.investigatorName:
                if (selectedRow === indexedRow.epidemiologyNumber && investigatorAutoCompleteClicked) {
                    return (
                        <Autocomplete
                            PopperComponent={CustomPopper}
                            test-id='currentInvetigationUser'
                            options={Array.from(allUsersOfCurrCounty, ([id, value]) => ({ id, value }))}
                            getOptionLabel={(option) => option.value.userName}
                            renderOption={(option, { selected }) => (
                                option.value.userName ?
                                    <>
                                        <div>
                                            <Typography variant='body1' color='textSecondary'>
                                                {investigatorNameMsg} :
                                                <b>
                                                    {option.value.userName}
                                                </b>
                                                <br></br>
                                                {newInvestigationsMsg} :
                                                <b>
                                                    {option.value.newInvestigationsCount}
                                                </b>
                                            &nbsp;&nbsp;
                                            {activeInvestigationsMsg} :
                                                <b>
                                                    {option.value.activeInvestigationsCount}
                                                </b>
                                            </Typography>
                                        </div>
                                    </>
                                    :
                                    ''
                            )}
                            inputValue={selectedInvestigator.userName}
                            onChange={(event, newSelectedInvestigator) => {
                                onInvestigatorChange(indexedRow, newSelectedInvestigator, indexedRow.investigatorName)
                            }}
                            onInputChange={(event, selectedInvestigatorName) => {
                                const updatedInvestigator = {
                                    id: getUserMapKeyByValue(allUsersOfCurrCounty, selectedInvestigatorName),
                                    userName: selectedInvestigatorName
                                }
                                setSelectedInvestigator(updatedInvestigator);
                            }}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    placeholder='חוקר'
                                />
                            }
                            classes={{
                                option: classes.userSelectOption
                            }}
                        />)
                }
                else {
                    return indexedRow[cellName as keyof typeof TableHeadersNames]
                }
            case TableHeadersNames.county:
                if (selectedRow === indexedRow.epidemiologyNumber && countyAutoCompleteClicked) {
                    return (
                        <Autocomplete
                            options={Array.from(allCounties, ([id, value]) => ({ id, value }))}
                            getOptionLabel={(option) => option.value.displayName}
                            inputValue={currCounty.displayName}
                            onChange={(event, newSelectedCounty) => {
                                onCountyChange(indexedRow, newSelectedCounty, indexedRow.county)
                            }}
                            onInputChange={(event, selectedCounty) => {
                                const updatedCounty: County = {
                                    id: getCountyMapKeyByValue(allCounties, selectedCounty),
                                    displayName: selectedCounty
                                }
                                setCurrCounty(updatedCounty);
                            }}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    placeholder='נפה'
                                />
                            }
                        />)
                }
                else {
                    return indexedRow[cellName as keyof typeof TableHeadersNames]
                }
            default:
                return indexedRow[cellName as keyof typeof TableHeadersNames]
        }
    }

    const handleRequestSort = (event: any, property: React.SetStateAction<string>) => {
        const isAsc = orderBy === property && order === sortOrders.asc;
        const newOrder = isAsc ? sortOrders.desc : sortOrders.asc
        setOrder(newOrder);
        setOrderBy(property);
        property === defaultOrderBy ? sortInvestigationTable(property) : sortInvestigationTable(property + newOrder.toLocaleUpperCase());
    };

    return (
        <>
            <Typography color='textPrimary' className={classes.welcomeMessage}>
                {tableRows.length === 0 ? noInvestigationsMessage : welcomeMessage}
            </Typography>
            <div className={classes.content}>
                <div className={classes.tableHeaderButton}>
                    <Button
                        color='primary'
                        className={classes.sortResetButton}
                        startIcon={<RefreshIcon />}
                        onClick={(event: any) => handleRequestSort(event, defaultOrderBy)}
                    >
                        {resetSortButtonText}
                    </Button>
                </div>
                <TableContainer component={Paper} className={classes.tableContainer}>
                    <Table aria-label='simple table' stickyHeader id='LandingPageTable'>
                        <TableHead>
                            <TableRow>
                                {
                                    Object.values((user.userType === userType.ADMIN || user.userType === userType.SUPER_ADMIN) ? adminCols : userCols).map((key) => (
                                        <TableCell
                                            className={key === TableHeadersNames.investigatorName ? classes.columnBorder : ''}
                                            sortDirection={orderBy === key ? order : false}
                                        >
                                            {
                                                TableHeaders[key as keyof typeof TableHeadersNames]
                                            }
                                            {
                                                sortableCols[key as keyof typeof TableHeadersNames] &&
                                                <TableSortLabel
                                                    classes={{ root: key === orderBy ? classes.activeSortIcon : '', icon: classes.icon, active: classes.active }}
                                                    active
                                                    direction={orderBy === key ? order : sortOrders.asc}
                                                    onClick={(event: any) => handleRequestSort(event, key)}>
                                                </TableSortLabel>
                                            }
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
                                        onClick={() => onInvestigationRowClick(indexedRow)}
                                    >
                                        {
                                            Object.values((user.userType === userType.ADMIN || user.userType === userType.SUPER_ADMIN) ? adminCols : userCols).map((key: string) => (
                                                <TableCell
                                                    className={getTableCellStyles(index, key).join(' ')}
                                                    onClick={(event: any) => {
                                                        if (key === TableHeadersNames.investigatorName || key === TableHeadersNames.county) {
                                                            event.stopPropagation();
                                                            key === TableHeadersNames.county ? setCountyAutoCompleteClicked(true) :
                                                                setInvestigatorAutoCompleteClicked(true);
                                                            setSelectedRow(indexedRow.epidemiologyNumber);
                                                        }
                                                    }}
                                                >
                                                    {
                                                        getTableCell(key, indexedRow)
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
