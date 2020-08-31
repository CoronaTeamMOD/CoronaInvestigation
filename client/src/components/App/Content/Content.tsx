import React from 'react';
import {Route, Switch, Redirect } from 'react-router-dom';

import {investigationFormRoute, landingPageRoute} from 'Utils/Routes/Routes';

import LandingPage from  './LandingPage/LandingPage';
import InvestigationForm from './InvestigationForm/InvestigationForm';

const Content: React.FC = (): JSX.Element => {
  
    return (
        <Switch>
            <Route path={investigationFormRoute} component={InvestigationForm} />
            <Route path= {landingPageRoute} component={LandingPage} />
            <Redirect from='/' to={landingPageRoute}/>
        </Switch>
    )
}

export default Content;
