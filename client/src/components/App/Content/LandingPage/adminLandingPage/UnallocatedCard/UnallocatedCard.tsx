import React, { useState } from 'react';
import { Card, Tooltip, Typography } from '@material-ui/core';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import LoadingCard from '../LoadingCard/LoadingCard';
import useStyles, { cardHeight, cardWidth } from './UnallocatedCardStyles';
import FilterRulesVariables from 'models/FilterRulesVariables';
import useUnallocatedCard from './useUnallocatedCard';

const unallocatedInvestigationsText = 'חקירות לא משויכות/ משויכות לחוקרים לא פעילים';

const unallocateFilter : FilterRulesVariables = {inactiveUserFilter: true, unassignedUserFilter: true};

const UnallocatedCard: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles();

    const { onClick, investigationInfoFilter } = props;

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [unallocatedCount, setUnallocatedCount] = useState<number>(0);

    useUnallocatedCard({setIsLoading, setUnallocatedCount, investigationInfoFilter});

    return (
        <Tooltip title={unallocatedInvestigationsText}>
            <LoadingCard isLoading={isLoading} width={cardWidth} height={cardHeight} className={classes.unallocatedCard}>
                <Card onClick={() => onClick(unallocateFilter)}>
                    <div className={classes.investigationAmount}>
                        <Typography className={classes.investigationNumberText}><b>{unallocatedCount}</b></Typography>
                        <Typography className={classes.investigationAmountText}><b>חקירות</b></Typography>
                    </div>
                    <div className={classes.unallocatedInvestigations}>
                        <Typography className={classes.unallocatedInvestigationsText}><b>ממתינות להקצאה</b></Typography>
                        <NavigateBeforeIcon className={classes.navigateIcon} />
                    </div>
                </Card>
            </LoadingCard>
        </Tooltip>
    )
}

export default UnallocatedCard;

interface Props {
    onClick: (infoFilter: FilterRulesVariables) => void;
    investigationInfoFilter: FilterRulesVariables;
}
