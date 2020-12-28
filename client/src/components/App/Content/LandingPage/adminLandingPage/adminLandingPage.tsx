import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@material-ui/core';

import useAppToolbar from 'components/App/AppToolbar/useAppToolbar';

import InvestigationChart from 'models/InvestigationChart';
import InvestigationStatistics from 'models/InvestigationStatistics';

import useStyles from './adminLandingPageStyles';
import TimeRangeCard from './TimeRangeCard/timeRangeCard';
import UnassignedCard from './UnassignedCard/UnassignedCard';
import DesksFilterCard from './desksFilterCard/desksFilterCard';
import InvestigationsInfo from './investigationsInfo/investigationsInfo';

const AdminLandingPage: React.FC = (): JSX.Element => {
    const classes = useStyles();

    const [allInvestigationsCount, setAllInvestigationsCount] = useState<number>(0);
    const [investigationsStatistics, setInvestigationsStatistics] = useState<InvestigationStatistics>({
        inProcessInvestigations: 0,
        inactiveInvestigations: 0,
        newInvestigations: 0,
        unassignedInvestigations: 0
    })

    const { countyDisplayName } = useAppToolbar();

    useEffect(() => {
        axios.post<InvestigationStatistics & {allInvestigations: number}>('/landingPage/investigationStatistics')
        .then((response) => {
            const { data: {allInvestigations, ...statistics} } = response;
            setAllInvestigationsCount(allInvestigations);
            setInvestigationsStatistics(statistics);
        });
    }, [])

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
                    <InvestigationsInfo investigationsStatistics={investigationsStatistics} investigationsCount={allInvestigationsCount} />
                </Grid>
                <Grid item xs={3}>
                    <TimeRangeCard />
                </Grid>
                <Grid item xs={3}>
                    <UnassignedCard />
                </Grid>
            </Grid>
        </div>
    )
}

export default AdminLandingPage;
