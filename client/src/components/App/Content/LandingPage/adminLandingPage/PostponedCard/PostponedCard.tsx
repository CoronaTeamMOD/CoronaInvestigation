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

const postponedInvestigationsTitle = 'חקירות מושהות';
const transferRequestText = 'חקירות שתת הסטטוס שלהן הוא נדרשת העברה';
const transferRequestTitle = 'חקירות הממתינות להעברה';
const waitingForDetailsText = 'חקירות שתת הסטטוס שלהן הוא מחכה להשלמת פרטים';
const waitingForDetailsTitle = 'חקירות הממתינות להשלמת פרטים';

const PostponedCard: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles();
    const hoverClasses = useHoverStyles();

    const { onClick, isLoading, transferRequestInvestigationsCount, waitingForDetailsInvestigationsCount } = props;

    return (
        <LoadingCard isLoading={isLoading} height={cardHeight} className={classes.postponedCard}>
            <div className={classes.investigationAmount}>
                <Pause className={classes.pauseIcon}/>
                <Typography><b>{postponedInvestigationsTitle}</b></Typography>
            </div>
            <Tooltip title={transferRequestText}>
                <div 
                    className={[classes.filterText, hoverClasses.whiteButtons].join(' ')} 
                    onClick={() => onClick(statusToFilterConvertor[FilterRulesDescription.TRANSFER_REQUEST], FilterRulesDescription.TRANSFER_REQUEST)}
                >
                    <Box display='flex'>
                    <Typography className={classes.investigationNumberText}><b>{transferRequestInvestigationsCount}</b></Typography>
                        <Typography className={classes.investigationText}><b>{transferRequestTitle}</b></Typography>
                        <NavigateBeforeIcon className={classes.navigateIcon} />
                    </Box>
                </div>
            </Tooltip>
            <Divider/>
            <Tooltip title={waitingForDetailsText}>
                <div  
                    className={[classes.filterText, hoverClasses.whiteButtons].join(' ')} 
                    onClick={() => onClick(statusToFilterConvertor[FilterRulesDescription.WAITING_FOR_DETAILS], FilterRulesDescription.WAITING_FOR_DETAILS)}
                >
                    <Box display='flex'>
                        <Typography className={classes.investigationNumberText}><b>{waitingForDetailsInvestigationsCount}</b></Typography>
                        <Typography className={classes.investigationText}><b>{waitingForDetailsTitle}</b></Typography>
                        <NavigateBeforeIcon className={classes.navigateIcon} />
                    </Box>
                </div>
            </Tooltip>
        </LoadingCard>
    )
}

export default PostponedCard;

interface Props {
    onClick: (infoFilter: FilterRulesVariables, FilterRulesDescription: FilterRulesDescription) => void;
    isLoading: boolean;
    transferRequestInvestigationsCount: number;
    waitingForDetailsInvestigationsCount: number;
}
