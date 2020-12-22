import React from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Tooltip} from '@material-ui/core'; 

import User from 'models/User';
import { get } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';

import useStyles from './InvestigatorsTableStyles';
import { TableHeadersNames, TableHeaders } from './InvestigatorsTableHeaders';

const pauseInvestigationsCountTitle = 'חקירות הממתינות להשלמת מידע/העברה';

const InvestigatorsTable: React.FC<Props> = ({ investigators, selectedRow, setSelectedRow }) => {

    const classes = useStyles();

    const getTableHeader = (cellName: string) => {
        switch(cellName) {
            case TableHeadersNames.pauseInvestigationsCount:
                return (
                    <Tooltip title={pauseInvestigationsCountTitle}>
                        <b>{get(TableHeaders, cellName)}</b>
                    </Tooltip>
                )
            default: 
                return <b>{get(TableHeaders, cellName)}</b>
        }
    }

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
                                        { getTableHeader(cellName) }
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
                                className={classes.tableRow}
                                classes={{selected: classes.selectedRow}}
                            >
                                {
                                    Object.keys(TableHeaders).map((cellHeader: string) => (
                                        <TableCell key={cellHeader}>
                                            { getTableCell(investigator, cellHeader) }
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