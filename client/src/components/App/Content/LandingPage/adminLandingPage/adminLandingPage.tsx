import React from 'react';
import { Button, Card, CardActions, CardContent, Grid, Typography } from '@material-ui/core';

import DatePick from 'commons/DatePick/DatePick';
import useAppToolbar from 'components/App/AppToolbar/useAppToolbar';

import useStyles from './adminLandingPageStyles';
import UnassignedCard from './UnassignedCard/UnassignedCard';
import DesksFilterCard from './desksFilterCard/desksFilterCard';
import InvestigationsInfo from './investigationsInfo/investigationsInfo';

const AdminLandingPage: React.FC = (): JSX.Element => {
    const classes = useStyles();

    const { countyDisplayName } = useAppToolbar();

    return (
        <div className={classes.content}>
            <Typography color='textPrimary' className={classes.countyDisplayName}>
                <b>{'נפת ' + countyDisplayName}</b>
            </Typography>
            <Grid container spacing={5} className={classes.gridContainer}>
                <Grid item xs={3}>
                    <DesksFilterCard/>
                </Grid>
                <Grid item xs={9}>
                    <InvestigationsInfo/>
                </Grid>
                <Grid item xs={3}>
                    <Card className={classes.timeRangeCard}>
                        <CardContent className={classes.TimeRangeCardContent}>
                            <Typography variant='h6' className={classes.cardTitle}>
                                <b>טווח זמנים</b>
                            </Typography>
                            <DatePick
                                value={new Date()}
                                onChange={() => {}}
                            />
                        </CardContent>
                        <CardActions style={{ direction: 'ltr', paddingLeft: '1vw' }}>
                            <Button
                                className={classes.updateButton}
                                variant='contained'
                                size='small'>
                                עדכון
                    </Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={3}>
                    <UnassignedCard />
                </Grid>
            </Grid>
        </div>
    )
}

export default AdminLandingPage;
