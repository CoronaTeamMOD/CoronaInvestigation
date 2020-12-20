import React from 'react';

import useStyles from './adminLandingPageStyles';
import InvestigationTable from '../InvestigationTable/InvestigationTable';

const LandingPage: React.FC = (): JSX.Element => {
    const classes = useStyles();
  
    return (
        <div className={classes.content}>
            <div>admin</div>
            <InvestigationTable/>
        </div>
    )
}

export default LandingPage;
