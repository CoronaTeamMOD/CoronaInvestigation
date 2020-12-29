import { useHistory } from 'react-router-dom';
import { Grid, Typography } from '@material-ui/core';
import React, { useState, useEffect, useRef } from 'react';

import { landingPageRoute } from 'Utils/Routes/Routes';
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
    
    const history = useHistory();

    const renderedForFirstTime = useRef(true);

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
    useAdminLandingPage({setIsLoading, investigationInfoFilter, setInvestigationsStatistics});

    // A useEffect whenever there is a need to redirect to the investigation table
    useEffect(() => {
        if (!renderedForFirstTime.current) {
            // append with desk/time filter when done
            // P.S: when finishing the time filter make sure 
            //      that the history in useInvestigationTable.ts is expecting to recive it
            // Good Luck! 😁 R.R
            history.push(landingPageRoute, {...investigationInfoFilter});
        }
        renderedForFirstTime.current = false;
    }, [investigationInfoFilter]);

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
                        onInfoButtonClick={(infoFilter) => setInvestigationInfoFilter(infoFilter)} />
                </Grid>
                <Grid item xs={3}>
                    <TimeRangeCard />
                </Grid>
                <Grid item xs={3}>
                    <UnallocatedCard
                        isLoading={isLoading}
                        onClick={(infoFilter) => setInvestigationInfoFilter(infoFilter)} 
                        unallocatedInvestigationsCount={investigationsStatistics.unallocatedInvestigations}
                    />
                </Grid>
            </Grid>
        </div>
    )
}

export default AdminLandingPage;
