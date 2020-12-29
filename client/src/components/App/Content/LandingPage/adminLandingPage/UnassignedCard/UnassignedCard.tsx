import React from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Tooltip, Typography } from '@material-ui/core';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import useStyles from './UnassignedCardStyles';

const unnasignedInvestigationsText = 'חקירות לא משויכות/ משויכות לחוקרים לא פעילים';

const UnassignedCard: React.FC = (): JSX.Element => {
    const classes = useStyles();

    let history = useHistory();

    return (
        <Tooltip title={unnasignedInvestigationsText}>
            <Card className={classes.unassignedCard} onClick={() => {}}>
                <div className={classes.investigationAmount}>
                    <Typography className={classes.investigationNumberText}><b>13</b></Typography>
                    <Typography className={classes.investigationAmountText}><b>חקירות</b></Typography>
                </div>
                <div className={classes.unnasignedInvestigations}>
                    <Typography className={classes.unnasignedInvestigationsText}><b>ממתינות להקצאה</b></Typography>
                    <NavigateBeforeIcon className={classes.navigateIcon} />
                </div>
            </Card>
        </Tooltip>
    )
}

export default UnassignedCard;
