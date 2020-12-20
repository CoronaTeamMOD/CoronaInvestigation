import React from 'react';

import useStyles from './LandingPageStyles';
import InvestigationTable from '../InvestigationTable/InvestigationTable';

const LandingPage: React.FC = (): JSX.Element => {
    const classes = useStyles();
  
    return (
        <div className={classes.content}>
            <InvestigationTable/>
        </div>
    )
}

export default LandingPage;
