import React from 'react';
import WarningIcon from '@material-ui/icons/Warning';
import { Tooltip, Typography, Divider } from '@material-ui/core';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import FilterRulesVariables from 'models/FilterRulesVariables';
import statusToFilterConvertor from 'commons/statusToFilterConvertor';
import FilterRulesDescription from 'models/enums/FilterRulesDescription';

import useHoverStyles from '../useHoverStyles';
import LoadingCard from '../LoadingCard/LoadingCard';
import useStyles, { cardHeight, cardWidth } from './UnusualCardStyles';

const unusualCompletesInvestigationsText = 'חקירות אשר הושלמו ללא מגעים';
const unusualInProcessInvestigationsText = 'חקירות בטיפול מעל 4 שעות';

const UnusualCard: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles();
    const hoverClasses = useHoverStyles();

    const { onUnusualCompletedNoContactInvestigationsClick, onUnusualInProgressInvestigationsClick, isLoading, unusualInProgressInvestigationsCount, unusualCompletedNoContactInvestigationsCount} = props;

    return (
        <LoadingCard isLoading={isLoading} width={cardWidth} height={cardHeight} className={classes.unusualCard}>
            <div className={classes.unusualTitle}>
                <WarningIcon className={classes.warningIcon}></WarningIcon>
                <Typography><b>לתשומת ליבך</b></Typography>
            </div>
            <Tooltip className={[classes.unusualCompleted, hoverClasses.whiteButtons].join(' ')} title={unusualCompletesInvestigationsText}>
                <div onClick={() => onUnusualCompletedNoContactInvestigationsClick(statusToFilterConvertor[FilterRulesDescription.UNUSUAL_COMPLETED_NO_CONTACT])}>
                    <div className={classes.investigationAmount}>
                        <Typography className={classes.investigationNumberText}><b>{unusualCompletedNoContactInvestigationsCount}</b></Typography>
                        <Typography><b>חקירות</b></Typography>
                    </div>
                    <div className={classes.unusualInvestigations}>
                        <Typography ><b>{FilterRulesDescription.UNUSUAL_COMPLETED_NO_CONTACT}</b></Typography>
                        <NavigateBeforeIcon className={classes.navigateIcon} />
                    </div>
                </div>
            </Tooltip>
            <Divider/>
            <Tooltip className={[classes.unusualInProcess, hoverClasses.whiteButtons].join(' ')} title={unusualInProcessInvestigationsText}>
                <div  onClick={() => onUnusualInProgressInvestigationsClick(statusToFilterConvertor[FilterRulesDescription.UNUSUAL_IN_PROCESS])} >
                    <div className={classes.investigationAmount}>
                        <Typography className={classes.investigationNumberText}><b>{unusualInProgressInvestigationsCount}</b></Typography>
                        <Typography><b>חקירות</b></Typography>
                    </div>
                    <div className={classes.unusualInvestigations}>
                        <Typography><b>{FilterRulesDescription.UNUSUAL_IN_PROCESS}</b></Typography>
                        <NavigateBeforeIcon className={classes.navigateIcon} />
                    </div>
                </div>
            </Tooltip>
        </LoadingCard>
    )
}

export default UnusualCard;

interface Props {
    onUnusualCompletedNoContactInvestigationsClick: (infoFilter: FilterRulesVariables) => void;
    onUnusualInProgressInvestigationsClick: (infoFilter: FilterRulesVariables) => void;
    isLoading: boolean;
    unusualInProgressInvestigationsCount: number;
    unusualCompletedNoContactInvestigationsCount: number;
}
