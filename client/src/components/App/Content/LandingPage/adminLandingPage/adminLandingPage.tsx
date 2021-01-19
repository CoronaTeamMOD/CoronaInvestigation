import React, { useState } from 'react';
import { Grid, Typography } from '@material-ui/core';

import useAppToolbar from 'components/App/AppToolbar/useAppToolbar';
import FilterRulesDescription from 'models/enums/FilterRulesDescription';
import InvestigationStatistics, { InvesitgationInfoStatistics } from 'models/InvestigationStatistics';

import useStyles from './adminLandingPageStyles';
import useAdminLandingPage from './useAdminLandingPage';
import UnallocatedCard from './UnallocatedCard/UnallocatedCard';
import UnusualCard from './UnusualCard/UnusualCard';
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
        unusualInProgressInvestigations: 0,
        unusualCompletedNoContactInvestigations:0,
    });
    const [lastUpdated , setLastUpdated] = useState<Date>(new Date());

    const { countyDisplayName } = useAppToolbar();
    const { redirectToInvestigationTable , fetchInvestigationStatistics, 
            updateInvestigationFilterByDesks, updateInvestigationFilterByTime} = useAdminLandingPage({
        setIsLoading,
        setInvestigationsStatistics,
        setLastUpdated,
    });

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
                <Grid item xs={6} md={3}>
                    <UnallocatedCard
                        isLoading={isLoading}
                        onClick={(infoFilter) => redirectToInvestigationTable(infoFilter, FilterRulesDescription.UNALLOCATED)} 
                        unallocatedInvestigationsCount={investigationsStatistics.unallocatedInvestigations}
                    />
                </Grid>
                <Grid item xs={3}>
                    <UnusualCard
                        isLoading={isLoading}
                        onCompleteClick={(infoFilter) => redirectToInvestigationTable(infoFilter, FilterRulesDescription.UNUSUAL_COMPLETED_NO_CONTACT)} 
                        onInProcessClick={(infoFilter) => redirectToInvestigationTable(infoFilter, FilterRulesDescription.UNUSUAL_IN_PROCESS)} 
                        unusualInProgressInvestigationsCount={investigationsStatistics.unusualInProgressInvestigations}
                        unusualCompletedNoContactInvestigationsCount={investigationsStatistics.unusualCompletedNoContactInvestigations}
                    />
                </Grid>
            </Grid>
        </div>
    )
};

export default AdminLandingPage;
