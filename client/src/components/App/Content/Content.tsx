import React from 'react';
import {Route, Switch, Redirect } from 'react-router-dom';

import LoadingSpinner from 'commons/LoadingSpinner/LoadingSpinner';
import { investigationFormRoute, landingPageRoute, usersManagementRoute, finishedLogoutRoute } from 'Utils/Routes/Routes';

import SignUp from './SignUp/SignUp';
import LandingPage from  './LandingPage/LandingPage';
import InvestigationForm from './InvestigationForm/InvestigationForm';
import UsersManagement from './UsersManagement/UsersManagement'

const Content: React.FC<Props> = ({ isSignUpOpen, handleSaveUser, handleCloseSignUp }): JSX.Element => {
  
    return (
        <>
            <Switch>
                <Route path={investigationFormRoute} component={InvestigationForm} />
                <Route path={landingPageRoute} component={LandingPage} />
                <Route path={usersManagementRoute} component={UsersManagement} />
                <Redirect from={finishedLogoutRoute} to='/'/>
                <Redirect from='/' to={landingPageRoute}/>
            </Switch>
            <SignUp open={isSignUpOpen} handleSaveUser={handleSaveUser} handleCloseSignUp={handleCloseSignUp}/>
            <LoadingSpinner />
        </>
    )
}

interface Props {
    isSignUpOpen: boolean;
    handleSaveUser: () => void;
    handleCloseSignUp: () => void;
}

export default Content;
