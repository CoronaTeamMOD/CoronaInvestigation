import React from 'react';
import {Route, Switch, Redirect } from 'react-router-dom';

import LoadingSpinner from 'commons/LoadingSpinner/LoadingSpinner';
import {investigationFormRoute, landingPageRoute} from 'Utils/Routes/Routes';

import LandingPage from  './LandingPage/LandingPage';
import InvestigationForm from './InvestigationForm/InvestigationForm';
import SignUp from './SignUp/SignUp';

const Content: React.FC<Props> = ({ isSignUpOpen, handleCloseSignUp }): JSX.Element => {
  
    return (
        <>
            <Switch>
                <Route path={investigationFormRoute} component={InvestigationForm} />
                <Route path= {landingPageRoute} component={LandingPage} />
                <Redirect from='/' to={landingPageRoute}/>
            </Switch>
            <SignUp open={isSignUpOpen} handleCloseSignUp={handleCloseSignUp}/>
            <LoadingSpinner />
        </>
    )
}

interface Props {
    isSignUpOpen: boolean;
    handleCloseSignUp: () => void;
}

export default Content;
