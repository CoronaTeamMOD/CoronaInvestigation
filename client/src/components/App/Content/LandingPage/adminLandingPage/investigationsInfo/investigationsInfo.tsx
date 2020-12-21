import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Card, CardActions, CardContent, Grid } from '@material-ui/core';

import { landingPageRoute } from 'Utils/Routes/Routes';

import useStyles from './investigationsInfoStyles';
import InvestigationInfoButton from '../investigationInfoButton/investigationInfoButton';

const InvestigationsInfo: React.FC = (): JSX.Element => {
    const classes = useStyles();

    let history = useHistory();

    return (
        <Card className={classes.filtersCard}>
            <CardContent>
                <div>נתונים</div>
            </CardContent>
            <CardActions>
                <Grid container>
                    <Grid item xs={2}>
                        <InvestigationInfoButton
                            amountOfInvestigations={22}
                            text='חדשות'
                            className={classes.newButton}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <InvestigationInfoButton
                            amountOfInvestigations={45}
                            text='בטיפול'
                            className={classes.inProcessButton}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <InvestigationInfoButton
                            amountOfInvestigations={33}
                            text='לא משויכות'
                            className={classes.notAssignedButton}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <InvestigationInfoButton
                            amountOfInvestigations={12}
                            text='מוקצות לחוקרים לא פעילים'
                            className={classes.assignedToNotActiveButton}
                        />
                    </Grid>
                    <Button
                        onClick={() => {
                            history.push(landingPageRoute)
                            console.log('filter')
                        }}>
                        חקירות בסך הכל
                    </Button>
                </Grid>
            </CardActions>
        </Card>
    )
}

export default InvestigationsInfo;
