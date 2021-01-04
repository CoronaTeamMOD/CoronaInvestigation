import React, { useState } from 'react';
import { Grid, Typography } from '@material-ui/core';

import { TimeRange } from 'models/TimeRange';
import timeRanges from 'models/enums/timeRanges';
import FilterRulesVariables from 'models/FilterRulesVariables';
import FilterRulesDescription from 'models/enums/FilterRulesDescription';
import InvestigationStatistics, { InvesitgationInfoStatistics } from 'models/InvestigationStatistics';

import useStyles from './adminLandingPageStyles';
import useAdminLandingPage from './useAdminLandingPage';
import UnallocatedCard from './DashboardCards/UnallocatedCard/UnallocatedCard';
import DesksFilterCard from './DashboardCards/desksFilterCard/desksFilterCard';
import AdminLandingPageFilters from './AdminLandingPageFilters';
import useAppToolbar from 'components/App/AppToolbar/useAppToolbar';
import InvestigationsInfo from './investigationsInfo/investigationsInfo';
import TimeRangeFilterCard from './DashboardCards/TimeRangeFilterCard/timeRangeFilterCard';
import UnusualInvestigationsCard from "./DashboardCards/unusualInvestigationsCard/unusualInvestigationsCard";

const AdminLandingPage: React.FC = (): JSX.Element => {

    const classes = useStyles();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [investigationInfoFilter, setInvestigationInfoFilter] = useState<AdminLandingPageFilters>({});
    const [investigationsStatistics, setInvestigationsStatistics] = useState<InvestigationStatistics>({
        allInvestigations: 0,
        inProcessInvestigations: 0,
        inactiveInvestigations: 0,
        newInvestigations: 0,
        unassignedInvestigations: 0,
        unallocatedInvestigations: 0,
    });
    const [filteredDesks, setFilteredDesks] = useState<number[]>([]);
    const [timeRangeFilter, setTimeRangeFilter] = useState<TimeRange>(timeRanges[0]);
    const { countyDisplayName } = useAppToolbar();
    const { redirectToInvestigationTable } = useAdminLandingPage({
        setIsLoading,
        investigationInfoFilter,
        setInvestigationInfoFilter,
        setInvestigationsStatistics,
        filteredDesks,
        setFilteredDesks,
        timeRangeFilter,
        setTimeRangeFilter
    });

    return (
        <div className={classes.content}>
            <Typography color='textPrimary' className={classes.countyDisplayName}>
                <b>{'נפת ' + countyDisplayName}</b>
            </Typography>
            <Grid container spacing={5} className={classes.gridContainer}>
                <Grid item xs={3}>
                    <DesksFilterCard
                        filteredDesks={filteredDesks}
                        setFilteredDesks={setFilteredDesks}
                        investigationInfoFilter={investigationInfoFilter}
                        setInvestigationInfoFilter={setInvestigationInfoFilter}
                    />
                </Grid>
                <Grid item xs={9}>
                    <InvestigationsInfo
                        isLoading={isLoading}
                        allInvestigationsCount={investigationsStatistics.allInvestigations}
                        investigationsStatistics={investigationsStatistics as InvesitgationInfoStatistics}
                        onInfoButtonClick={(infoFilter, filterType) => redirectToInvestigationTable(infoFilter, filterType)} />
                </Grid>
                <Grid item xs={3}>
                    <TimeRangeFilterCard
                        timeRangeFilter={timeRangeFilter}
                        setTimeRangeFilter={setTimeRangeFilter}
                        investigationInfoFilter={investigationInfoFilter}
                        setInvestigationInfoFilter={setInvestigationInfoFilter}
                    />
                </Grid>
                <Grid item xs={3}>
                    <UnallocatedCard
                        isLoading={isLoading}
                        onClick={(infoFilter) => redirectToInvestigationTable(infoFilter, FilterRulesDescription.UNALLOCATED)}
                        unallocatedInvestigationsCount={investigationsStatistics.unallocatedInvestigations}
                    />
                </Grid>
                <Grid item xs={3}>
                    <UnusualInvestigationsCard
                        isLoading={isLoading}
                        onClick={(infoFilter) => redirectToInvestigationTable(infoFilter, FilterRulesDescription.UNALLOCATED)}
                        unallocatedInvestigationsCount={investigationsStatistics.unallocatedInvestigations}
                    />
                </Grid>
            </Grid>
        </div>
    )
};

export default AdminLandingPage;
