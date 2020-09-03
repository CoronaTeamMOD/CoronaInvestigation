import React from 'react';
import {useSelector} from 'react-redux';
import { Typography } from '@material-ui/core';

import User from 'models/User';
import StoreStateType from 'redux/storeStateType';

import useStyles from './LandingPageStyles';
import InvestigationTable from './InvestigationTable/InvestigationTable';

const welcomeMessage = 'היי, אלו הן החקירות שהוקצו לך היום. בואו נקטע את שרשראות ההדבקה!'

const LandingPage: React.FC = (): JSX.Element => {
    const classes = useStyles();
    const user = useSelector<StoreStateType, User>(state => state.user);
  
    return (
        <div className={classes.content}>
            <Typography color="textPrimary" className={classes.welcomeMessage}>
                {welcomeMessage}
            </Typography>
            <InvestigationTable/>
        </div>
    )
}

export default LandingPage;
