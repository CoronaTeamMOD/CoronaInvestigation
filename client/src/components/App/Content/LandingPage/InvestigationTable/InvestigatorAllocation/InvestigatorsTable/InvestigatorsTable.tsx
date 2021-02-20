import React, { useEffect, useState } from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Tooltip, TableSortLabel } from '@material-ui/core';
import _ from 'lodash'

import User from 'models/User';
import SearchBar from 'commons/SearchBar/SearchBar';
import { userValidationSchema } from 'Utils/UsersUtils/userUtils';
import { get } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';

import useStyles from './InvestigatorsTableStyles';
import { TableHeadersNames, TableHeaders, SortableTableHeaders } from './InvestigatorsTableHeaders';
import { Order } from '../../InvestigationTablesHeaders';
import SortOrder from 'models/enums/SortOrder';
export const defaultOrderBy = 'defaultOrder';
const pauseInvestigationsCountTitle = 'חקירות הממתינות להשלמת מידע/העברה';
const searchBarLabel = 'הכנס שם של חוקר או שם רשות...';
const authoritySourceOrganization = 'חוקר רשות';

const InvestigatorsTable: React.FC<Props> = ({ investigators, selectedRow, setSelectedRow }) => {

    const classes = useStyles();

    const [investigatorInput, setInvestigatorInput] = useState<string>('');
    const [filteredInvestigators, setFilteredInvestigators] = useState<User[]>(investigators);
    const [sortedInvestigators, setStortedInvestigators] = useState<User[]>(filteredInvestigators);
    const [order, setOrder] = useState<Order>(SortOrder.asc);
    const [orderBy, setOrderBy] = useState<string>(defaultOrderBy);
    const [orderByValue, setOrderByValue] = useState<string>(defaultOrderBy);

    useEffect(() => {
        setFilteredInvestigators(investigators)
        setStortedInvestigators(investigators)
    }, [investigators]);

    useEffect(() => {
        if (investigatorInput !== '') {
            const filteredArray = investigators.filter(investigator => investigator.userName.includes(investigatorInput) ||
                (investigator.authorityName && investigator?.authorityName.includes(investigatorInput)) ||
                (investigator.sourceOrganization && investigator?.sourceOrganization.includes(investigatorInput)));
            setFilteredInvestigators(filteredArray)
            sortInvestigators()
        } else {
            setFilteredInvestigators(investigators)
            sortInvestigators()
        }
    }, [investigatorInput]);

    useEffect(() => {
        sortInvestigators()
        }, [orderByValue]);

    const sortInvestigators = () => {
        switch(orderBy) {
            case 'username': {
                const orderd = _.orderBy(filteredInvestigators, [investigator => investigator['userName']], [order])
                setStortedInvestigators(orderd)
                break;
            }
            case 'sourceorganization': {
                const orderd = _.orderBy(filteredInvestigators, [investigator => investigator['sourceOrganization']], [order])
                setStortedInvestigators(orderd)
                break;
            }
            case 'deskname': {
                const orderd = _.orderBy(filteredInvestigators, [investigator => investigator['deskname']], [order])
                setStortedInvestigators(orderd)
                break;
            }
            default: {
                setStortedInvestigators(filteredInvestigators)
                break;
            }
        }
    }

    const handleRequestSort = (event: any, property: React.SetStateAction<string>) => {
        const isAsc = orderBy === property && order === SortOrder.asc;
        const newOrder = isAsc ? SortOrder.desc : SortOrder.asc;
        setOrder(newOrder);
        setOrderBy(property);
        property === defaultOrderBy ? setOrderByValue(property) : setOrderByValue(property + newOrder.toLocaleUpperCase());
    };

    const getTableCell = (investigator: User, cellName: string) => {
        switch (cellName) {
            case TableHeadersNames.deskName:
                return get(investigator, cellName) ? get(investigator, cellName) : 'לא משוייך';
            case TableHeadersNames.sourceOrganization:
                const sourceOrganization: string = get(investigator, cellName);
                const authorityName: string | null = investigator.authorityName;
                return (sourceOrganization === authoritySourceOrganization && authorityName) ? `${get(investigator, cellName)}-${authorityName}` : get(investigator, cellName);
            case TableHeadersNames.languages: {
                const languages: string[] = get(investigator, cellName);
                if (languages?.length > 2) {
                    return (
                        <Tooltip title={languages.join(', ')}>
                            <span>
                                {`${languages[0]}, ${languages[1]}...`}
                            </span>
                        </Tooltip>
                    )
                } else {
                    return languages?.join(', ')
                }
            }
            default:
                return get(investigator, cellName);
        }
    };

    return (
        <>
            <SearchBar
                id='search-bar'
                searchBarLabel={searchBarLabel}
                onClick={(value: string) => setInvestigatorInput(value)}
                onChange={(value: string) => setInvestigatorInput(value)}
                validationSchema={userValidationSchema}
            />
            <TableContainer component={Paper}>
                <Table stickyHeader>
                    <TableHead id='investigators-table-header'>
                        <TableRow>
                            {
                                Object.keys(TableHeaders).map((cellName: string) => {
                                    return (
                                        <TableCell key={cellName}
                                            sortDirection={orderBy === cellName ? order : false}
                                        >
                                            <Tooltip title={cellName === TableHeadersNames.pauseInvestigationsCount ? pauseInvestigationsCountTitle : ''}>
                                                <b>{get(TableHeaders, cellName)} </b>
                                            </Tooltip>
                                            { get(SortableTableHeaders, cellName) &&
                                                <TableSortLabel
                                                    classes={{ root: cellName === orderBy ? classes.activeSortIcon : '', icon: classes.icon, active: classes.active }}
                                                    active
                                                    direction={orderBy === cellName ? order : SortOrder.asc}
                                                    onClick={(event: any) => handleRequestSort(event, cellName)}>
                                                </TableSortLabel>
                                            }
                                        </TableCell>
                                    )
                                })
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            sortedInvestigators.map((investigator: User) => (
                                <TableRow
                                    id={`investigator-row-${investigator.id}`}
                                    key={investigator.id}
                                    selected={selectedRow === investigator.id}
                                    onClick={() => setSelectedRow(investigator.id)}
                                    classes={{ selected: classes.selected }}
                                    className={classes.tableRow}
                                >
                                    {
                                        Object.keys(TableHeaders).map((cellHeader: string) => (
                                            <TableCell key={cellHeader}>
                                                { getTableCell(investigator, cellHeader.toLocaleLowerCase())}
                                            </TableCell>
                                        ))
                                    }
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

interface Props {
    investigators: User[];
    selectedRow: string;
    setSelectedRow: React.Dispatch<React.SetStateAction<string>>;
}

export default InvestigatorsTable;