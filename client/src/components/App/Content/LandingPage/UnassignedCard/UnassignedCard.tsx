import React from 'react';
import { useHistory } from 'react-router-dom';
import { Card, IconButton, Typography } from '@material-ui/core';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import { landingPageRoute } from 'Utils/Routes/Routes';

import useStyles from './UnassignedCardStyles';

const UnassignedCard: React.FC = (): JSX.Element => {
    const classes = useStyles();

    let history = useHistory();

    return (
        <Card className={classes.unassignedCard}>
            <div className={classes.investigationAmount}>
                <Typography className={classes.investigationNumberText}><b>13</b></Typography>
                <Typography className={classes.investigationAmountText}><b>חקירות</b></Typography>
            </div>
            <div className={classes.allInvestigations}>
                <Typography className={classes.allInvestigationsText}><b>ממתינות להקצאה</b></Typography>
                <IconButton onClick={() => history.push(landingPageRoute)}>
                    <NavigateBeforeIcon className={classes.navigateIcon} />
                </IconButton>
            </div>
        </Card>
    )
}

export default UnassignedCard;
