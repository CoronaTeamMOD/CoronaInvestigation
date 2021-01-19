import React from 'react';
import { Tooltip, Typography, Box, Divider } from '@material-ui/core';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import { Pause } from '@material-ui/icons';


import FilterRulesVariables from 'models/FilterRulesVariables';
import statusToFilterConvertor from 'commons/statusToFilterConvertor';
import FilterRulesDescription from 'models/enums/FilterRulesDescription';

import useHoverStyles from '../useHoverStyles';
import LoadingCard from '../LoadingCard/LoadingCard';
import useStyles, { cardHeight } from './PostponedCardStyles';

const postponedInvestigationsText = 'חקירות לא משויכות/ משויכות לחוקרים לא פעילים';

const PostponedCard: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles();
    const hoverClasses = useHoverStyles();

    const { onClick, isLoading, transferRequestInvestigationsCount, waitingForDetailsInvestigationsCount } = props;

    return (
        <LoadingCard isLoading={isLoading} height={cardHeight} className={classes.postponedCard}>
            <div className={classes.investigationAmount}>
                <Pause className={classes.pauseIcon}/>
                <Typography className={classes.investigationAmountText}><b>חקירות מושהות</b></Typography>
            </div>
            <Tooltip title={postponedInvestigationsText}>
                <div className={hoverClasses.whiteButtons} onClick={() => onClick(statusToFilterConvertor[FilterRulesDescription.TRANSFER_REQUEST])}>
                    <Box display='flex'>
                        <Typography>
                            <b>
                                {transferRequestInvestigationsCount} 
                                {'חקירות ממתינות להעברה'}
                            </b>
                        </Typography>
                        <NavigateBeforeIcon className={classes.navigateIcon} />
                    </Box>
                </div>
            </Tooltip>
            <Divider/>
            <Tooltip title={postponedInvestigationsText}>
                <div className={hoverClasses.whiteButtons} onClick={() => onClick(statusToFilterConvertor[FilterRulesDescription.WAITING_FOR_DETAILS])}>
                    <Box display='flex'>
                        <Typography>
                            <b>
                                {waitingForDetailsInvestigationsCount}
                                {'חקירות ממתינות להשלמת פרטים'} 
                            </b>
                        </Typography>
                        <NavigateBeforeIcon className={classes.navigateIcon} />
                    </Box>
                </div>
            </Tooltip>
        </LoadingCard>
    )
}

export default PostponedCard;

interface Props {
    onClick: (infoFilter: FilterRulesVariables) => void;
    isLoading: boolean;
    transferRequestInvestigationsCount: number;
    waitingForDetailsInvestigationsCount: number;
}
