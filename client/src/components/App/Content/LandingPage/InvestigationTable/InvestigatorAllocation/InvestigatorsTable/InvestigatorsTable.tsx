import React, { useState } from 'react';
import { Autocomplete } from '@material-ui/lab';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Tooltip, TextField} from '@material-ui/core'; 

import User from 'models/User';
import { get } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';

import useStyles from './InvestigatorsTableStyles';
import { TableHeadersNames, TableHeaders } from './InvestigatorsTableHeaders';

const pauseInvestigationsCountTitle = 'חקירות הממתינות להשלמת מידע/העברה';

const InvestigatorsTable: React.FC<Props> = ({ investigators, selectedRow, setSelectedRow }) => {

    const classes = useStyles();
    const [investigatorInput, setInvestigatorInput] = useState<string>('');
    const [investigator, setInvestigator] = useState<User | null>(null);

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
            <Autocomplete
                options={investigators.map(investigator => ({ id: investigator.id, userName: investigator.userName }))}
                getOptionLabel={(option) => option.userName ? option.userName : ''}
                //inputValue={investigatorInput}
                //value={investigator.id}
                // onChange={(event, selectedInvestigator) => {
                //     setInvestigator(selectedInvestigator)
                // }}
                // onInputChange={(event, newInvestigatorInput) => {
                //     if (event?.type !== 'blur') {
                //         setInvestigatorInput(newInvestigatorInput);
                //     }
                // }}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        placeholder='חוקר'
                    />
                }
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
                            investigators.map((investigator: User, index: number) => (
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