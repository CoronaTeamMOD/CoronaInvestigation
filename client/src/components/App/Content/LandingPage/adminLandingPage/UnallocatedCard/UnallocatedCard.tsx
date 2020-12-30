import React from 'react';
import { Card, Tooltip, Typography } from '@material-ui/core';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import FilterRulesVariables from 'models/FilterRulesVariables';
import statusToFilterConvertor from 'commons/statusToFilterConvertor';
import FilterRulesDescription from 'models/enums/FilterRulesDescription';

import LoadingCard from '../LoadingCard/LoadingCard';
import useStyles, { cardHeight, cardWidth } from './UnallocatedCardStyles';

const unallocatedInvestigationsText = 'חקירות לא משויכות/ משויכות לחוקרים לא פעילים';

const UnallocatedCard: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles();

    const { onClick, isLoading, unallocatedInvestigationsCount } = props;

    return (
        <LoadingCard isLoading={isLoading} width={cardWidth} height={cardHeight} className={classes.unallocatedCard}>
            <Tooltip title={unallocatedInvestigationsText}>
                <Card onClick={() => onClick(statusToFilterConvertor[FilterRulesDescription.UNALLOCATED])}>
                    <div className={classes.investigationAmount}>
                        <Typography className={classes.investigationNumberText}><b>{unallocatedInvestigationsCount}</b></Typography>
                        <Typography className={classes.investigationAmountText}><b>חקירות</b></Typography>
                    </div>
                    <div className={classes.unallocatedInvestigations}>
                        <Typography className={classes.unallocatedInvestigationsText}><b>{FilterRulesDescription.UNALLOCATED}</b></Typography>
                        <NavigateBeforeIcon className={classes.navigateIcon} />
                    </div>
                </Card>
            </Tooltip>
        </LoadingCard>
    )
}

export default UnallocatedCard;

interface Props {
    onClick: (infoFilter: FilterRulesVariables) => void;
    isLoading: boolean;
    unallocatedInvestigationsCount: number;
}
