import React, { useState } from 'react';
import { Grid, Typography } from '@material-ui/core';

import FilterRulesVariables from 'models/FilterRulesVariables';
import useAppToolbar from 'components/App/AppToolbar/useAppToolbar';
import InvestigationStatistics, { InvesitgationInfoStatistics } from 'models/InvestigationStatistics';

import useStyles from './adminLandingPageStyles';
import useAdminLandingPage from './useAdminLandingPage';
import TimeRangeCard from './TimeRangeCard/timeRangeCard';
import UnallocatedCard from './UnallocatedCard/UnallocatedCard';
import DesksFilterCard from './desksFilterCard/desksFilterCard';
import InvestigationsInfo from './investigationsInfo/investigationsInfo';

const AdminLandingPage: React.FC = (): JSX.Element => {
    const classes = useStyles();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [investigationInfoFilter, setInvestigationInfoFilter] = useState<FilterRulesVariables>({});
    const [investigationsStatistics, setInvestigationsStatistics] = useState<InvestigationStatistics>({
        allInvestigations: 0,
        inProcessInvestigations: 0,
        inactiveInvestigations: 0,
        newInvestigations: 0,
        unassignedInvestigations: 0,
        unallocatedInvestigations: 0,
    });

    const { countyDisplayName } = useAppToolbar();
    const { redirectToInvestigationTable } = useAdminLandingPage({setIsLoading, investigationInfoFilter, setInvestigationsStatistics});

    return (
        <div className={classes.content}>
            <Typography color='textPrimary' className={classes.countyDisplayName}>
                <b>{'נפת ' + countyDisplayName}</b>
            </Typography>
            <Grid container spacing={5} className={classes.gridContainer}>
                <Grid item xs={3}>
                    <DesksFilterCard />
                </Grid>
                <Grid item xs={9}>
                    <InvestigationsInfo
                        isLoading={isLoading}
                        allInvestigationsCount={investigationsStatistics.allInvestigations}
                        investigationsStatistics={investigationsStatistics as InvesitgationInfoStatistics}
                        onInfoButtonClick={(infoFilter) => redirectToInvestigationTable(infoFilter)} />
                </Grid>
                <Grid item xs={3}>
                    <TimeRangeCard />
                </Grid>
                <Grid item xs={3}>
                    <UnallocatedCard
                        isLoading={isLoading}
                        onClick={(infoFilter) => redirectToInvestigationTable(infoFilter)} 
                        unallocatedInvestigationsCount={investigationsStatistics.unallocatedInvestigations}
                    />
                </Grid>
            </Grid>
        </div>
    )
}

export default AdminLandingPage;
