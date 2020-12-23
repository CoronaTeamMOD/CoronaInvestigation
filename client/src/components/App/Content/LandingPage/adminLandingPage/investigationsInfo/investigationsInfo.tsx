import React from 'react';
import { useHistory } from 'react-router-dom';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import { Card, CardActions, Grid, IconButton, Typography } from '@material-ui/core';

import { landingPageRoute } from 'Utils/Routes/Routes';

import useStyles from './investigationsInfoStyles';
import InvestigationInfoButton from '../investigationInfoButton/investigationInfoButton';

const InvestigationsInfo: React.FC = (): JSX.Element => {
    const classes = useStyles();

    let history = useHistory();

    return (
        <Card className={classes.filtersCard}>
            <CardActions>
                <Grid container>
                    <Grid item xs={3}>
                    </Grid>
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
                    <Grid item xs={1}>
                    </Grid>
                    <div>
                        <div className={classes.investigationAmount}>
                            <Typography className={classes.investigationAmountText}><b>{102}</b></Typography>
                        </div>
                        <div className={classes.allInvestigations}>
                            <Typography className={classes.allInvestigationsText}><b>חקירות בסך הכל</b></Typography>
                            <IconButton onClick={() => history.push(landingPageRoute)}>
                                <NavigateBeforeIcon className={classes.navigateIcon} />
                            </IconButton>
                        </div>
                    </div>
                </Grid>
            </CardActions>
        </Card>
    )
}

export default InvestigationsInfo;
