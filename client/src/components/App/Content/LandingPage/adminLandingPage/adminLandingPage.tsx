import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Typography } from '@material-ui/core';

import StoreStateType from 'redux/storeStateType';
import FilterRulesDescription from 'models/enums/FilterRulesDescription';
import InvestigationStatistics, { InvesitgationInfoStatistics } from 'models/InvestigationStatistics';

import useStyles from './adminLandingPageStyles';
import useAdminLandingPage from './useAdminLandingPage';
import PostponedCard from './PostponedCard/PostponedCard';
import UnallocatedCard from './UnallocatedCard/UnallocatedCard';
import DesksFilterCard from './desksFilterCard/desksFilterCard';
import LastUpdateMessage from './LastUpdateMessage/LastUpdateMessage';
import InvestigationsInfo from './investigationsInfo/investigationsInfo';
import TimeRangeFilterCard from './TimeRangeFilterCard/TimeRangeFilterCard';

const AdminLandingPage: React.FC = (): JSX.Element => {

    const classes = useStyles();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [investigationsStatistics, setInvestigationsStatistics] = useState<InvestigationStatistics>({
        allInvestigations: 0,
        inProcessInvestigations: 0,
        inactiveInvestigations: 0,
        newInvestigations: 0,
        unassignedInvestigations: 0,
        unallocatedInvestigations: 0,
        transferRequestInvestigations: 0,
        waitingForDetailsInvestigations: 0,

    });
    const [lastUpdated , setLastUpdated] = useState<Date>(new Date());

    const { redirectToInvestigationTable , fetchInvestigationStatistics, 
            updateInvestigationFilterByDesks, updateInvestigationFilterByTime} = useAdminLandingPage({
        setIsLoading,
        setInvestigationsStatistics,
        setLastUpdated,
    });

    const countyDisplayName = useSelector<StoreStateType, string>(state => state.user.data.countyByInvestigationGroup.displayName);

    return (
        <div className={classes.content}>
            <Grid container spacing={5} className={classes.gridContainer}>
                <Grid item xs={6} md={3}>
                    <Typography color='textPrimary'>
                        <b>{'נפת ' + countyDisplayName}</b>
                    </Typography>
                </Grid>
                <Grid item xs={6} md={9}>
                    <LastUpdateMessage lastUpdated={lastUpdated} fetchInvestigationStatistics={fetchInvestigationStatistics}/>
                </Grid>
                <Grid item xs={12} md={3}>
                    <DesksFilterCard
                        onUpdateButtonClicked={updateInvestigationFilterByDesks}
                    />
                </Grid>
                <Grid item xs={12} md={9}>
                    <InvestigationsInfo
                        isLoading={isLoading}
                        allInvestigationsCount={investigationsStatistics.allInvestigations}
                        investigationsStatistics={investigationsStatistics as InvesitgationInfoStatistics}
                        onInfoButtonClick={(infoFilter, filterType) => redirectToInvestigationTable(infoFilter, filterType)} />
                </Grid>
                <Grid item xs={6} md={3}>
                    <TimeRangeFilterCard 
                        onUpdateButtonClicked={updateInvestigationFilterByTime}
                    />
                </Grid>
                <Grid item xs={12} md={2}>
                    <div>
                        <UnallocatedCard
                            isLoading={isLoading}
                            onClick={(infoFilter) => redirectToInvestigationTable(infoFilter, FilterRulesDescription.UNALLOCATED)} 
                            unallocatedInvestigationsCount={investigationsStatistics.unallocatedInvestigations}
                        />
                    </div>
                    <div className={classes.gridContainer}>
                        <PostponedCard
                            isLoading={isLoading}
                            onClick={(infoFilter, FilterRulesDescription) => redirectToInvestigationTable(infoFilter, FilterRulesDescription)} 
                            transferRequestInvestigationsCount={investigationsStatistics.transferRequestInvestigations}
                            waitingForDetailsInvestigationsCount={investigationsStatistics.waitingForDetailsInvestigations}
                        />
                    </div>
                </Grid>
            </Grid>
        </div>
    )
};

export default AdminLandingPage;
