import React, { useEffect, useState } from 'react';
import { Autocomplete } from '@material-ui/lab';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Tooltip, TextField} from '@material-ui/core'; 

import User from 'models/User';
import { get } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';

import useStyles from './InvestigatorsTableStyles';
import { TableHeadersNames, TableHeaders } from './InvestigatorsTableHeaders';
import SearchBar from 'commons/SearchBar/SearchBar';

const pauseInvestigationsCountTitle = 'חקירות הממתינות להשלמת מידע/העברה';
const searchBarLabel = 'הכנס שם של חוקר...';

const InvestigatorsTable: React.FC<Props> = ({ investigators, selectedRow, setSelectedRow }) => {

    const classes = useStyles();
    const [investigatorInput, setInvestigatorInput] = useState<string>('');
    const [investigator, setInvestigator] = useState<User | null>(null);
    const [filteredInvestigators, setFilteredInvestigators] = useState<User[]>(investigators);

    useEffect(() => {
        setFilteredInvestigators(investigators)
    }, [investigators]);
    
    useEffect(() => {
        if(investigatorInput !== '') {
            const filteredArray = investigators.filter(investigator => investigator.userName.includes(investigatorInput))
            setFilteredInvestigators(filteredArray)   
        } else {
            setFilteredInvestigators(investigators)
        }
    }, [investigatorInput]);

    const getTableCell = (investigator: User, cellName: string) => {
        switch(cellName) {
            case TableHeadersNames.deskName: 
                return get(investigator, cellName) ? get(investigator, cellName) : 'לא משוייך';
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
    }

    return (
        <>
            <SearchBar
                searchBarLabel={searchBarLabel}
                onClick={(value: string) => setInvestigatorInput(value)}
            />
            <TableContainer component={Paper}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {
                                Object.keys(TableHeaders).map((cellName: string) => {
                                    return (
                                        <TableCell key={cellName}>
                                            <Tooltip title={cellName === TableHeadersNames.pauseInvestigationsCount ? pauseInvestigationsCountTitle: ''}>
                                                <b>{get(TableHeaders, cellName)}</b>
                                            </Tooltip>
                                        </TableCell>
                                    )
                                })
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            filteredInvestigators.map((investigator: User, index: number) => (
                                <TableRow 
                                    key={investigator.id}
                                    selected={selectedRow === index}
                                    onClick={() => setSelectedRow(index)}
                                    classes={{ selected: classes.selected }}
                                    className={classes.tableRow}
                                    >
                                    {
                                        Object.keys(TableHeaders).map((cellHeader: string) => (
                                            <TableCell key={cellHeader}>
                                                { getTableCell(investigator, cellHeader.toLocaleLowerCase()) }
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
    selectedRow: number;
    setSelectedRow: React.Dispatch<React.SetStateAction<number>>;
}

export default InvestigatorsTable;