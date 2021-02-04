import React, { useEffect, useState } from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Tooltip} from '@material-ui/core'; 

import User from 'models/User';
import SearchBar from 'commons/SearchBar/SearchBar';
import { userValidationSchema } from 'Utils/UsersUtils/userUtils';
import { get } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';

import useStyles from './InvestigatorsTableStyles';
import { TableHeadersNames, TableHeaders } from './InvestigatorsTableHeaders';

const pauseInvestigationsCountTitle = 'חקירות הממתינות להשלמת מידע/העברה';
const searchBarLabel = 'הכנס שם של חוקר...';
const authoritySourceOrganization = 'חוקר רשות';

const InvestigatorsTable: React.FC<Props> = ({ investigators, selectedRow, setSelectedRow }) => {

    const classes = useStyles();

    const [investigatorInput, setInvestigatorInput] = useState<string>('');
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
                searchBarLabel={searchBarLabel}
                onClick={(value: string) => setInvestigatorInput(value)}
                onChange={(value: string) => setInvestigatorInput(value)}
                validationSchema={userValidationSchema}
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
                            filteredInvestigators.map((investigator: User) => (
                                <TableRow 
                                    key={investigator.id}
                                    selected={selectedRow === investigator.id}
                                    onClick={() => setSelectedRow(investigator.id)}
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
    selectedRow: string;
    setSelectedRow: React.Dispatch<React.SetStateAction<string>>;
}

export default InvestigatorsTable;