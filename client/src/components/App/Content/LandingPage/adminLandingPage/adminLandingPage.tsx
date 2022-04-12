import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Typography } from '@material-ui/core';

import StoreStateType from 'redux/storeStateType';
import InvestigationStatistics, { InvesitgationInfoStatistics } from 'models/InvestigationStatistics';

import useStyles from './adminLandingPageStyles';
import AdminActions from './adminActions/adminActions';
import useAdminLandingPage from './useAdminLandingPage';
import adminInvestigation from 'models/adminInvestigation';
import DesksFilterCard from './desksFilterCard/desksFilterCard';
import LastUpdateMessage from './LastUpdateMessage/LastUpdateMessage';
import InvestigationsInfo from './investigationsInfo/investigationsInfo';
import TimeRangeFilterCard from './TimeRangeFilterCard/TimeRangeFilterCard';
import AdminInvestigationsTable from './adminInvestigationsTable/adminInvestigationsTable';

const AdminLandingPage: React.FC = (): JSX.Element => {

    const classes = useStyles();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAdminInvestigationsLoading, setAdminInvestigationsIsLoading] = useState<boolean>(true);
    const [investigationsStatistics, setInvestigationsStatistics] = useState<InvestigationStatistics>({
        allInvestigations: 0,
        inProcessInvestigations: 0,
        newInvestigations: 0,
        unallocatedInvestigations: 0,
        unusualInProgressInvestigations: 0,
        transferRequestInvestigations: 0,
        waitingForDetailsInvestigations: 0,
        unallocatedDeskInvestigations:0
    });
    const [adminInvestigations, setadminInvestigations] = useState<adminInvestigation[]>([]); 
    const [lastUpdated , setLastUpdated] = useState<Date>(new Date());

    const { redirectToInvestigationTable , fetchInvestigationStatistics, 
            updateInvestigationFilterByDesks, updateInvestigationFilterByTime,
            fetchAdminInvestigations, investigationInfoFilter} = useAdminLandingPage({
        setIsLoading,
        setInvestigationsStatistics,
        setadminInvestigations,
        setLastUpdated,
        setAdminInvestigationsIsLoading
    });

    const countyDisplayName = useSelector<StoreStateType, string>(state => state.user.data.countyByInvestigationGroup.displayName);

    return (
        <div className={classes.content}>
            <Grid container spacing={5} className={classes.gridContainer}>
                <Grid item xs={6} md={3}>
                    <Typography color='textPrimary' id='county-name'>
                        <b>{'נפת ' + countyDisplayName}</b>
                    </Typography>
                </Grid>
                <Grid item xs={6} md={9}>
                    <LastUpdateMessage lastUpdated={lastUpdated} 
                    fetchInvestigationStatistics={fetchInvestigationStatistics}
                    fetchAdminInvestigations={fetchAdminInvestigations}/>
                </Grid>
                <Grid container item xs={12} justify='space-between'>
                    <Grid container direction='column' item spacing={3} xs={12} md={3}>
                        <Grid item>
                            <DesksFilterCard
                                onUpdateButtonClicked={updateInvestigationFilterByDesks}
                            />
                        </Grid>
                        <Grid item>
                            <TimeRangeFilterCard 
                                onUpdateButtonClicked={updateInvestigationFilterByTime}
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={9}>
                        <InvestigationsInfo
                            isLoading={isLoading}
                            allInvestigationsCount={investigationsStatistics.allInvestigations}
                            investigationsStatistics={investigationsStatistics as InvesitgationInfoStatistics}
                            onInfoButtonClick={(infoFilter, filterType) => redirectToInvestigationTable(infoFilter, filterType)} 
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <AdminInvestigationsTable
                        isLoading={isAdminInvestigationsLoading}
                        adminInvestigations={adminInvestigations}
                        fetchAdminInvestigations={fetchAdminInvestigations}
                    />
                </Grid>
                <Grid item xs={12}>
                    <AdminActions
                        investigationInfoFilter={[]}/>
                </Grid>
            </Grid>
        </div>
    )
};

export default AdminLandingPage;
