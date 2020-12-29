import axios from 'axios';
import { useHistory } from 'react-router-dom';
import React, { useMemo, useState, useEffect } from 'react';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import { CardContent, Grid, IconButton, Typography } from '@material-ui/core';

import { landingPageRoute } from 'Utils/Routes/Routes';
import InvestigationChart from 'models/InvestigationChart';
import InvestigationStatistics from 'models/InvestigationStatistics';

import LoadingCard from '../LoadingCard/LoadingCard';

import statusToFilterConvertor from './statusToFilterConvertor';
import useStyles, { cardWidth, cardHeight } from './investigationsInfoStyles';
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

const InvestigationsInfo: React.FC<Props> = ({ onInfoButtonClick }): JSX.Element => {
    const classes = useStyles();

    const [allInvestigationsCount, setAllInvestigationsCount] = useState<number>(0);
    const [investigationsStatistics, setInvestigationsStatistics] = useState<InvestigationStatistics>({
        inProcessInvestigations: 0,
        inactiveInvestigations: 0,
        newInvestigations: 0,
        unassignedInvestigations: 0
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setIsLoading(true);
        axios.post<InvestigationStatistics & {allInvestigations: number}>('/landingPage/investigationStatistics')
        .then((response) => {
            const { data: {allInvestigations, ...statistics} } = response;
            setAllInvestigationsCount(allInvestigations);
            setInvestigationsStatistics(statistics);
            setIsLoading(false);
        });
    }, [])

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
    onInfoButtonClick: (infoFilter: any) => void;
}

export default InvestigationsInfo;