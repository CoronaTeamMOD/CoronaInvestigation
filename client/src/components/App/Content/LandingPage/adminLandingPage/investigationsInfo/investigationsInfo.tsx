import React, { useMemo } from 'react';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import { CardContent, Grid, IconButton, Typography } from '@material-ui/core';

import InvestigationChart from 'models/InvestigationChart';
import FilterRulesVariables from 'models/FilterRulesVariables';
import statusToFilterConvertor from 'commons/statusToFilterConvertor';
import FilterRulesDescription from 'models/enums/FilterRulesDescription';
import { InvesitgationInfoStatistics } from 'models/InvestigationStatistics';

import useHoverStyles from '../useHoverStyles';
import LoadingCard from '../LoadingCard/LoadingCard';
import useStyles, { cardHeight } from './investigationsInfoStyles';
import InvestigationBarChart from './InvestigationBarChart/InvestigationBarChart'; // todo: remove and uninstall
import InvestigationInfoButton from './investigationInfoButton/investigationInfoButton';

// todo: seperate to another file
export const convertorsToGraph: { [T in keyof InvesitgationInfoStatistics]: Omit<InvestigationChart, 'value'> } = {
    newInvestigations: {
        id: FilterRulesDescription.NEW,
        color: '#1F78B4'
    },
    inProcessInvestigations: {
        id: FilterRulesDescription.IN_PROCESS,
        color: 'grey'
    },
    unallocatedInvestigations: {
        id: FilterRulesDescription.UNALLOCATED,
        color: 'grey'
    },
    transferRequestInvestigations: {
        id: FilterRulesDescription.TRANSFER_REQUEST,
        color: 'grey'
    },
    unusualInProgressInvestigations: {
        id: FilterRulesDescription.UNUSUAL_IN_PROCESS,
        color: 'grey'
    },
    unusualCompletedNoContactInvestigations: {
        id: FilterRulesDescription.UNUSUAL_COMPLETED_NO_CONTACT,
        color: 'grey'
    },
    waitingForDetailsInvestigations: {
        id: FilterRulesDescription.WAITING_FOR_DETAILS,
        color: 'grey'
    }
}

const InvestigationsInfo = (props: Props): JSX.Element => {
    const classes = useStyles();
    const hoverClasses = useHoverStyles();

    const { onInfoButtonClick, investigationsStatistics, allInvestigationsCount, isLoading } = props;

    const investigationsGraphData: InvestigationChart[] = useMemo<InvestigationChart[]>(() => {
        return Object.keys(convertorsToGraph).map((convertor) => ({
            ...convertorsToGraph[convertor as keyof InvesitgationInfoStatistics],
            value: investigationsStatistics[convertor as keyof InvesitgationInfoStatistics]
        }));
    }, [investigationsStatistics])

    return (
        <LoadingCard isLoading={isLoading} height={cardHeight} className={classes.filtersCard}>
            <CardContent>
                <Grid container>
                    <Grid item container xs={12} alignItems='flex-end' justify='space-around'>
                        <Grid item container alignItems='stretch' spacing={3} xs={12}>
                        {
                            investigationsGraphData.map((InvestigationData: InvestigationChart , index) => (
                                <Grid item xs={3}>
                                    <InvestigationInfoButton
                                        id={`info-button-${index}`}
                                        key={`investigationInfoButton-${index}`}
                                        amountOfInvestigations={InvestigationData.value}
                                        text={InvestigationData.id}
                                        style={{ backgroundColor: InvestigationData.color }}
                                        onClick={() => onInfoButtonClick(statusToFilterConvertor[InvestigationData.id], InvestigationData.id)}
                                    />
                                </Grid>
                            ))
                        }
                        </Grid>
                    </Grid>
                    <Grid item xs={12} className={[classes.investigationAmountContainer, hoverClasses.whiteButtons].join(' ')} onClick={() => onInfoButtonClick({})}>
                        <Typography id='investigations-count' className={classes.investigationAmountText}><b>{allInvestigationsCount}</b></Typography>
                        <Typography><b>חקירות בסך הכל</b></Typography>
                        <IconButton id='next-page-arrow'>
                            <NavigateBeforeIcon className={classes.navigateIcon} />
                        </IconButton>
                    </Grid>
                </Grid>
            </CardContent>
        </LoadingCard>
    )
}

interface Props {
    onInfoButtonClick: (infoFilter: FilterRulesVariables, filterType?: FilterRulesDescription) => void;
    investigationsStatistics: InvesitgationInfoStatistics;
    allInvestigationsCount: number;
    isLoading: boolean;

}

export default InvestigationsInfo;
