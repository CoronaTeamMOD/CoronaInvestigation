import _ from 'lodash';
import axios from 'axios';
import { format } from 'date-fns';
import logger from 'logger/logger';
import { persistor } from 'redux/store';
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import ProgressBar from "@ramonak/react-progress-bar";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Tooltip, TableSortLabel } from '@material-ui/core';

import User from 'models/User';
import { Severity } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import SortOrder from 'models/enums/SortOrder';
import LoadingCard from '../LoadingCard/LoadingCard';
import adminInvestigation from 'models/adminInvestigation';
import { get } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';
import useStyles, { cardHeight } from './adminInvestigationsTableStyles';
import { Order } from '../../InvestigationTable/InvestigationTablesHeaders';
import { setComplexReasonsId } from 'redux/Investigation/investigationActionCreators';
import { setInvestigationStatus } from 'redux/Investigation/investigationActionCreators';
import { setLastOpenedEpidemiologyNum } from 'redux/Investigation/investigationActionCreators';
import { TableHeadersNames, TableHeaders, SortableTableHeaders } from './adminInvestigationsTableHeaders';

const investigationURL = '/investigation';
export const defaultOrderBy = 'defaultOrder';

const AdminInvestigationsTable: React.FC<Props> = ({ adminInvestigations, fetchAdminInvestigations, isLoading }) => {

    const classes = useStyles();
    const orderBytype = adminInvestigations[0];
    const user = useSelector<StoreStateType, User>(state => state.user.data);
    const [sortedAdminInvestigations, setSortedAdminInvestigations] = useState<adminInvestigation[]>(adminInvestigations);
    const [order, setOrder] = useState<Order>(SortOrder.asc);
    const [orderBy, setOrderBy] = useState<keyof typeof orderBytype | typeof defaultOrderBy >(defaultOrderBy);
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
        property === defaultOrderBy ? setOrderByValue(property) : setOrderByValue(property + newOrder.toUpperCase());
    };

    const getTableCell = (adminInvestigation: adminInvestigation, cellName: string) => {
        switch (cellName) {
            case TableHeadersNames.creationDate:
                let creationDate = new Date(get(adminInvestigation, cellName));
                return (format(creationDate,'dd/MM/yyyy HH:MM'));
            case TableHeadersNames.deskName:
                return get(adminInvestigation, cellName) ? get(adminInvestigation, cellName) : 'לא משוייך';
            case TableHeadersNames.hours:
                let barProps = getProgressLength(get(adminInvestigation, cellName));
                return (<Tooltip title={barProps.hours + ' שעות'} arrow placement='top'>
                            <div>
                                <ProgressBar completed={barProps.progressLen} bgColor={barProps.color} isLabelVisible={false}/>
                            </div>
                         </Tooltip>);
            default:
                return get(adminInvestigation, cellName);
        }
    };

    const getProgressLength = (hours : number) => {
        let props = {hours, progressLen: 100, color: 'red'};

        if(hours <= 2) {
            props.progressLen = 25;
            props.color = 'green';
        } else if (hours <= 3) {
            props.progressLen = 50;
            props.color = 'yellow';
        } else if (hours <= 4) {
            props.progressLen = 75;
            props.color = 'orange';
        }

        return props;
    }

    const onInvestigationRowClick = async (adminInvestigation: adminInvestigation) => {
        const getComplexityReasonClickLogger = logger.setupVerbose({
            workflow: 'get Complexity Reason when opening an investigation',
            investigation: adminInvestigation.id,
            user: user.id
        });
        await axios.get('/investigationInfo/getComplexityReason/'+ adminInvestigation.id)
            .then((result) => {
                if (result?.data && result.headers['content-type'].includes('application/json')) {
                    setComplexReasonsId(result.data)
                    getComplexityReasonClickLogger.info('the chosen investigation have complexity reasons', Severity.LOW);
                } else { 
                    setComplexReasonsId([]) 
                    getComplexityReasonClickLogger.info('the chosen investigation dont have complexity reasons', Severity.LOW);
                    }
            })
            .catch((errorMessage) => { getComplexityReasonClickLogger.error(errorMessage, Severity.HIGH); })
        setInvestigationStatus({
            mainStatus: adminInvestigation.investigationStatus,
            subStatus: adminInvestigation.subStatus,
            statusReason: adminInvestigation.statusReason
        });

        moveToTheInvestigationForm(adminInvestigation.id);
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
                                            <b>{get(TableHeaders, cellName)}</b>
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
                                    onClick={() => onInvestigationRowClick(adminInvestigation)}
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
    fetchAdminInvestigations: (orderBy: string) => void;
    isLoading: boolean;
}

export default AdminInvestigationsTable;