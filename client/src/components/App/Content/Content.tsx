import React from 'react';
import {Route, Switch } from 'react-router-dom';

import TabObj from 'models/TabObj';

import InvestigationForm from './InvestigationForm/InvestigationForm';
import LandingPage from  './LandingPage/LandingPage';

const Content: React.FC = (): JSX.Element => {
  
    return (
        <Switch>
            <Route path= "/investigation" component={InvestigationForm} />
            <Route path= "/landing" component={LandingPage} />
            <Route path= "/" component={LandingPage} />  
        </Switch>
    )
}

export default Content;
