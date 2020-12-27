import React from 'react';
import { useHistory } from 'react-router-dom';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import { Card, CardActions, Grid, IconButton, Typography } from '@material-ui/core';

import { landingPageRoute } from 'Utils/Routes/Routes';
import InvestigationChart from 'models/InvestigationChart';

import useStyles from './investigationsInfoStyles';
import InvestigationPieChart from './InvestigationPieChart/InvestigationPieChart';
import InvestigationChartData from './InvestigationPieChart/InvestigationChartData';
import InvestigationInfoButton from './investigationInfoButton/investigationInfoButton';

const InvestigationsInfo: React.FC = (): JSX.Element => {
    const classes = useStyles();

    let history = useHistory();

    return (
        <Card className={classes.filtersCard}>
            <CardActions>
                <Grid container>
                    <Grid item xs={3}>
                        <div style={{ height: '14vh' }}>
                            <InvestigationPieChart />
                        </div>
                    </Grid>
                    {
                        InvestigationChartData.map((InvestigationData: InvestigationChart) => (
                            <Grid item xs={2}>
                                <InvestigationInfoButton
                                    amountOfInvestigations={InvestigationData.value}
                                    text={InvestigationData.id}
                                    style={{ backgroundColor: InvestigationData.color }}
                                />
                            </Grid>
                        ))
                    }
                    <Grid item xs={1}>
                    </Grid>
                    <div className={classes.investigationAmountContainer}>
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
