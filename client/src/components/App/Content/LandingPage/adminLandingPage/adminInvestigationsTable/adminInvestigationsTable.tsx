import _ from 'lodash';
import { persistor } from 'redux/store';
import React, { useEffect, useState } from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Tooltip, TableSortLabel } from '@material-ui/core';

import SortOrder from 'models/enums/SortOrder';
import LoadingCard from '../LoadingCard/LoadingCard';
import adminInvestigation from 'models/adminInvestigation';
import { get } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';
import useStyles, { cardHeight } from './adminInvestigationsTableStyles';
import { Order } from '../../InvestigationTable/InvestigationTablesHeaders';
import { setLastOpenedEpidemiologyNum } from 'redux/Investigation/investigationActionCreators';
import { TableHeadersNames, TableHeaders, SortableTableHeaders } from './adminInvestigationsTableHeaders';

const investigationURL = '/investigation';
export const defaultOrderBy = 'defaultOrder';

const AdminInvestigationsTable: React.FC<Props> = ({ adminInvestigations, setSelectedRow, fetchAdminInvestigations, isLoading }) => {

    const classes = useStyles();
    const orderBytype = adminInvestigations[0]
    const [sortedAdminInvestigations, setSortedAdminInvestigations] = useState<adminInvestigation[]>(adminInvestigations);
    const [order, setOrder] = useState<Order>(SortOrder.asc);
    const [orderBy, setOrderBy] = useState<keyof typeof orderBytype | 'defaultOrder'>(defaultOrderBy);
    const [orderByValue, setOrderByValue] = useState<string>(defaultOrderBy);

    useEffect(() => {
        setSortedAdminInvestigations(adminInvestigations)
    }, [adminInvestigations]);

    useEffect(() => {
        fetchAdminInvestigations(orderByValue);
    }, [orderByValue]);

    const handleRequestSort = ( property: React.SetStateAction<keyof typeof orderBytype | 'defaultOrder'>) => {
        const isAsc = orderBy === property && order === SortOrder.asc;
        const newOrder = isAsc ? SortOrder.desc : SortOrder.asc;
        setOrder(newOrder);
        setOrderBy(property);
        property === defaultOrderBy ? setOrderByValue(property) : setOrderByValue(property + newOrder.toLocaleUpperCase());
    };

    const getTableCell = (adminInvestigation: adminInvestigation, cellName: string) => {
        switch (cellName) {
            case TableHeadersNames.deskName:
                return get(adminInvestigation, cellName) ? get(adminInvestigation, cellName) : 'לא משוייך';
            default:
                return get(adminInvestigation, cellName);
        }
    };

    const moveToTheInvestigationForm = async (epidemiologyNumberVal: number) => {
        setLastOpenedEpidemiologyNum(epidemiologyNumberVal);
        await persistor.flush();
        window.open(investigationURL);
    };

    return (
        <LoadingCard isLoading={isLoading} height={cardHeight}>
            <TableContainer className={classes.tableStyle} component={Paper}>
                <Table stickyHeader>
                    <TableHead id='investigators-table-header'>
                        <TableRow>
                            {
                                Object.keys(TableHeaders).map((cellName: string) => {
                                    return (
                                        <TableCell key={cellName}
                                            sortDirection={orderBy === cellName ? order : false}
                                        >
                                            <Tooltip title={''}>
                                                <b>{get(TableHeaders, cellName)} </b>
                                            </Tooltip>
                                            { get(SortableTableHeaders, cellName) &&
                                                <TableSortLabel
                                                    classes={{ root: cellName === orderBy ? classes.activeSortIcon : '', icon: classes.icon, active: classes.active }}
                                                    active
                                                    direction={orderBy === cellName ? order : SortOrder.asc}
                                                    onClick={() => handleRequestSort( cellName as (keyof typeof orderBytype | 'defaultOrder'))}>
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
                            sortedAdminInvestigations.map((adminInvestigation: adminInvestigation) => (
                                <TableRow
                                    id={`adminInvestigation-row-${adminInvestigation.id}`}
                                    key={adminInvestigation.id}
                                    onClick={() => moveToTheInvestigationForm(adminInvestigation.id)}
                                    classes={{ selected: classes.selected }}
                                    className={classes.tableRow}>
                                    {
                                        Object.keys(TableHeaders).map((cellHeader: string) => (
                                            <TableCell key={cellHeader}>
                                                { getTableCell(adminInvestigation, cellHeader.toLocaleLowerCase())}
                                            </TableCell>
                                        ))
                                    }
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </LoadingCard>
    );
};

interface Props {
    adminInvestigations: adminInvestigation[];
    setSelectedRow: React.Dispatch<React.SetStateAction<string>>;
    fetchAdminInvestigations: (orderBy: string) => void;
    isLoading: boolean;
}

export default AdminInvestigationsTable;