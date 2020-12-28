import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import { Card, CardContent, Grid, IconButton, Typography } from '@material-ui/core';

import { landingPageRoute } from 'Utils/Routes/Routes';
import InvestigationChart from 'models/InvestigationChart';
import InvestigationStatistics from 'models/InvestigationStatistics';

import useStyles from './investigationsInfoStyles';
import InvestigationBarChart from './InvestigationBarChart/InvestigationBarChart';
import InvestigationInfoButton from './investigationInfoButton/investigationInfoButton';

const convertorsToGraph: { [T in keyof InvestigationStatistics]: Omit<InvestigationChart, 'value'>} = {
    newInvestigations: {
        id: 'חדשות',
        color: '#1F78B4'
    },
    inProcessInvestigations: {
        id: 'בטיפול',
        color: 'grey'
    },
    unassignedInvestigations: {
        id: 'לא משויכות',
        color: '#33A02C'
    },
    inactiveInvestigations: {
        id: 'מוקצות לחוקרים לא פעילים',
        color: '#F95959'
    }
}

const InvestigationsInfo: React.FC<Props> = ({ investigationsStatistics, investigationsCount }): JSX.Element => {
    const classes = useStyles();

    let history = useHistory();

    const investigationsGraphData = useMemo<InvestigationChart[]>(() => {
        const returnedArray:InvestigationChart[] = [];
        Object.keys(convertorsToGraph).forEach((convertor) => {
            returnedArray.push({
                ...convertorsToGraph[convertor as keyof InvestigationStatistics],
                value: investigationsStatistics[convertor as keyof InvestigationStatistics]
            });
        });
        return returnedArray;
    }, [investigationsStatistics])

    return (
        <Card className={classes.filtersCard}>
            <CardContent>
                <Grid container>
                    <Grid item xs={12} className={classes.investigationInfoButtonWrapper}>
                        <div className={classes.investigationsGraphContainer}>
                            <InvestigationBarChart investigationsGraphData={investigationsGraphData} />
                        </div>
                        {
                            investigationsGraphData.map((InvestigationData: InvestigationChart) => (
                                <InvestigationInfoButton
                                    amountOfInvestigations={InvestigationData.value}
                                    text={InvestigationData.id}
                                    style={{ backgroundColor: InvestigationData.color }}
                                />
                            ))
                        }
                    </Grid>
                    <Grid item xs={12} className={classes.investigationAmountContainer}>
                        <Typography className={classes.investigationAmountText}><b>{investigationsCount}</b></Typography>
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

interface Props {
    investigationsCount: number;
    investigationsStatistics: InvestigationStatistics;
}

export default InvestigationsInfo;