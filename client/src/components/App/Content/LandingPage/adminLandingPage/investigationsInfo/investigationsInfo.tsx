import React, { useMemo } from 'react';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import { CardContent, Grid, IconButton, Typography } from '@material-ui/core';

import InvestigationChart from 'models/InvestigationChart';
import FilterRulesVariables from 'models/FilterRulesVariables';
import { InvesitgationInfoStatistics } from 'models/InvestigationStatistics';

import LoadingCard from '../LoadingCard/LoadingCard';

import statusToFilterConvertor from './statusToFilterConvertor';
import useStyles, { cardWidth, cardHeight } from './investigationsInfoStyles';
import InvestigationBarChart from './InvestigationBarChart/InvestigationBarChart';
import InvestigationInfoButton from './investigationInfoButton/investigationInfoButton';


const convertorsToGraph: { [T in keyof InvesitgationInfoStatistics]: Omit<InvestigationChart, 'value'>} = {
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

const InvestigationsInfo: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles();

    const { onInfoButtonClick, investigationsStatistics, allInvestigationsCount, isLoading } = props;

    const investigationsGraphData = useMemo<InvestigationChart[]>(() => {
        const returnedArray:InvestigationChart[] = [];
        Object.keys(convertorsToGraph).forEach((convertor) => {
            returnedArray.push({
                ...convertorsToGraph[convertor as keyof InvesitgationInfoStatistics],
                value: investigationsStatistics[convertor as keyof InvesitgationInfoStatistics]
            });
        });
        return returnedArray;
    }, [investigationsStatistics])

    return (
        <LoadingCard isLoading={isLoading} width={cardWidth} height={cardHeight} className={classes.filtersCard}>
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
                                    onClick={() => onInfoButtonClick(statusToFilterConvertor[InvestigationData.id as keyof typeof statusToFilterConvertor])}
                                />
                            ))
                        }
                    </Grid>
                    <Grid item xs={12} className={classes.investigationAmountContainer}>
                        <Typography className={classes.investigationAmountText}><b>{allInvestigationsCount}</b></Typography>
                        <Typography className={classes.allInvestigationsText}><b>חקירות בסך הכל</b></Typography>
                        <IconButton onClick={() => onInfoButtonClick({})}>
                            <NavigateBeforeIcon className={classes.navigateIcon} />
                        </IconButton>
                    </Grid>
                </Grid>
            </CardContent>
        </LoadingCard>
    )
}

interface Props {
    onInfoButtonClick: (infoFilter: FilterRulesVariables) => void;
    investigationsStatistics: InvesitgationInfoStatistics;
    allInvestigationsCount: number;
    isLoading: boolean;

}

export default InvestigationsInfo;