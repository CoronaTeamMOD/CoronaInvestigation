import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@material-ui/core';

import useAppToolbar from 'components/App/AppToolbar/useAppToolbar';

import useStyles from './adminLandingPageStyles';
import TimeRangeCard from './TimeRangeCard/timeRangeCard';
import UnassignedCard from './UnassignedCard/UnassignedCard';
import DesksFilterCard from './desksFilterCard/desksFilterCard';
import InvestigationsInfo from './investigationsInfo/investigationsInfo';
import { DeskFilter } from '../InvestigationTable/InvestigationTableInterfaces';

const AdminLandingPage: React.FC = (): JSX.Element => {
    const classes = useStyles();

    const [investigationInfoFilter, setInvestigationInfoFilter] = useState({});
    const [deskFilter, setDeskFilter] = useState<DeskFilter>([]);
    const [unassignedUserFilter, setUnassignedUserFilter] = useState<boolean>(false);
    const [inactiveUserFilter, setInactiveUserFilter] = useState<boolean>(false);

    const { countyDisplayName } = useAppToolbar();

    useEffect(() => {
        console.log(investigationInfoFilter);
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
                    <InvestigationsInfo onInfoButtonClick={(infoFilter) => setInvestigationInfoFilter(infoFilter)} />
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
