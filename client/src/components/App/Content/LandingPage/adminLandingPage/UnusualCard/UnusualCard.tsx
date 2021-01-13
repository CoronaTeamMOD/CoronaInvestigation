import React from 'react';
import { Tooltip, Typography,Divider } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import FilterRulesVariables from 'models/FilterRulesVariables';
import statusToFilterConvertor from 'commons/statusToFilterConvertor';
import FilterRulesDescription from 'models/enums/FilterRulesDescription';

import useHoverStyles from '../useHoverStyles';
import LoadingCard from '../LoadingCard/LoadingCard';
import useStyles, { cardHeight, cardWidth } from './UnusualCardStyles';

const unusualCompletesInvestigationsText = 'חקירות אשר הושלמו ללא מגעים';
const unusualTreatmentInvestigationsText = 'חקירות בטיפול מעל 4 שעות';

const UnusualCard: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles();
    const hoverClasses = useHoverStyles();

    const { onCompleteClick, onTreatmentClick, isLoading, unusualInvestigationsCount } = props;

    return (
        <LoadingCard isLoading={isLoading} width={cardWidth} height={cardHeight} className={classes.unusualCard}>
            <div className={classes.unusualTitle}>
                <WarningIcon className={classes.warningIcon}></WarningIcon>
                <Typography className={classes.unusualTitleText}><b>לתשומת ליבך</b></Typography>
            </div>
            <Tooltip className={[classes.unusualCompleted, hoverClasses.whiteButtons].join(' ')} title={unusualCompletesInvestigationsText}>
                <div>
                    <div className={classes.investigationAmount}>
                        <Typography className={classes.investigationNumberText}><b>{unusualInvestigationsCount}</b></Typography>
                        <Typography className={classes.investigationAmountText}><b>חקירות</b></Typography>
                    </div>
                    <div onClick={() => onCompleteClick(statusToFilterConvertor[FilterRulesDescription.UNALLOCATED])} className={classes.unusualInvestigations}>
                        <Typography className={classes.unusualInvestigationsText}><b>{FilterRulesDescription.UNUSUAL_COMPLETED}</b></Typography>
                        <NavigateBeforeIcon className={classes.navigateIcon} />
                    </div>
                </div>
            </Tooltip>
            <Divider></Divider>
            <Tooltip className={[classes.unusualTreatment, hoverClasses.whiteButtons].join(' ')} title={unusualTreatmentInvestigationsText}>
                <div>
                    <div className={classes.investigationAmount}>
                        <Typography className={classes.investigationNumberText}><b>{unusualInvestigationsCount}</b></Typography>
                        <Typography className={classes.investigationAmountText}><b>חקירות</b></Typography>
                    </div>
                    <div onClick={() => onTreatmentClick(statusToFilterConvertor[FilterRulesDescription.UNALLOCATED])} className={classes.unusualInvestigations}>
                        <Typography className={classes.unusualInvestigationsText}><b>{FilterRulesDescription.UNUSUAL_IN_TREATMENT}</b></Typography>
                        <NavigateBeforeIcon className={classes.navigateIcon} />
                    </div>
                </div>
            </Tooltip>
        </LoadingCard>
    )
}

export default UnusualCard;

interface Props {
    onCompleteClick: (infoFilter: FilterRulesVariables) => void;
    onTreatmentClick: (infoFilter: FilterRulesVariables) => void;
    isLoading: boolean;
    unusualInvestigationsCount: number;
}
