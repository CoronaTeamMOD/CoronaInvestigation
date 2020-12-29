import { useHistory } from 'react-router-dom';
import { Grid, Typography } from '@material-ui/core';
import React, { useState, useEffect, useRef } from 'react';

import { landingPageRoute } from 'Utils/Routes/Routes';
import FilterRulesVariables from 'models/FilterRulesVariables';
import useAppToolbar from 'components/App/AppToolbar/useAppToolbar';

import useStyles from './adminLandingPageStyles';
import TimeRangeCard from './TimeRangeCard/timeRangeCard';
import UnallocatedCard from './UnallocatedCard/UnallocatedCard';
import DesksFilterCard from './desksFilterCard/desksFilterCard';
import InvestigationsInfo from './investigationsInfo/investigationsInfo';
import { DeskFilter } from '../InvestigationTable/InvestigationTableInterfaces';

const AdminLandingPage: React.FC = (): JSX.Element => {
    const classes = useStyles();
    
    const history = useHistory();

    const renderedForFirstTime = useRef(true);

    const [investigationInfoFilter, setInvestigationInfoFilter] = useState<FilterRulesVariables>({});

    const { countyDisplayName } = useAppToolbar();
    
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
                    <InvestigationsInfo onInfoButtonClick={(infoFilter) => setInvestigationInfoFilter(infoFilter)} />
                </Grid>
                <Grid item xs={3}>
                    <TimeRangeCard />
                </Grid>
                <Grid item xs={3}>
                    <UnallocatedCard 
                        onClick={(infoFilter) => setInvestigationInfoFilter(infoFilter)} 
                        investigationInfoFilter={investigationInfoFilter}
                    />
                </Grid>
            </Grid>
        </div>
    )
}

export default AdminLandingPage;
