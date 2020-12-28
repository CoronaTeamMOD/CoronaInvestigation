import React from 'react';
import { useHistory } from 'react-router-dom';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import { Card, CardContent, Grid, IconButton, Typography } from '@material-ui/core';

import { landingPageRoute } from 'Utils/Routes/Routes';
import InvestigationChart from 'models/InvestigationChart';

import useStyles from './investigationsInfoStyles';
import InvestigationBarChart from './InvestigationBarChart/InvestigationBarChart';
import InvestigationChartData from './InvestigationBarChart/InvestigationChartData';
import InvestigationInfoButton from './investigationInfoButton/investigationInfoButton';

const InvestigationsInfo: React.FC = (): JSX.Element => {
    const classes = useStyles();

    let history = useHistory();

    return (
        <Card className={classes.filtersCard}>
            <CardContent>
                <Grid container>
                    <Grid item xs={12} className={classes.investigationInfoButtonWrapper}>
                        <div className={classes.investigationsGraphContainer}>
                            <InvestigationBarChart />
                        </div>
                        {
                            InvestigationChartData.map((InvestigationData: InvestigationChart) => (
                                <InvestigationInfoButton
                                    amountOfInvestigations={InvestigationData.value}
                                    text={InvestigationData.id}
                                    style={{ backgroundColor: InvestigationData.color }}
                                />
                            ))
                        }
                    </Grid>
                    <Grid item xs={12} className={classes.investigationAmountContainer}>
                        <Typography className={classes.investigationAmountText}><b>{102} </b></Typography>
                        <Typography className={classes.allInvestigationsText}><b>חקירות בסך הכל</b></Typography>
                        <IconButton onClick={() => history.push(landingPageRoute)}>
                            <NavigateBeforeIcon className={classes.navigateIcon} />
                        </IconButton>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default InvestigationsInfo;
