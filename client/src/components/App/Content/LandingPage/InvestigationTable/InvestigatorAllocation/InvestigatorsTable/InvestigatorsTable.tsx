import React from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Tooltip} from '@material-ui/core'; 

import User from 'models/User';
import { get } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';

import useStyles from './InvestigatorsTableStyles';
import { TableHeadersNames, TableHeaders } from './InvestigatorsTableHeaders';

const pauseInvestigationsCountTitle = 'חקירות הממתינות להשלמת מידע/העברה';

const InvestigatorsTable: React.FC<Props> = ({ investigators, selectedRow, setSelectedRow }) => {

    const classes = useStyles();

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
    );
};

interface Props {
    investigators: User[];
    selectedRow: number;
    setSelectedRow: React.Dispatch<React.SetStateAction<number>>;
}

export default InvestigatorsTable;