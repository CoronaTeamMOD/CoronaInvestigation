import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';

import UserTypeCodes from 'models/enums/UserTypeCodes';
import StoreStateType from 'redux/storeStateType';
import LoadingSpinner from 'commons/LoadingSpinner/LoadingSpinner';
import { investigationFormRoute, landingPageRoute, usersManagementRoute, indexRoute, adminLandingPageRoute, createComplexityReasons } from 'Utils/Routes/Routes';

import SignUp from './SignUp/SignUp';
import UsersManagement from './UsersManagement/UsersManagement';
import InvestigationForm from './InvestigationForm/InvestigationForm';
import LandingPage from './LandingPage/defaultLandingPage/LandingPage';
import adminLandingPage from './LandingPage/adminLandingPage/adminLandingPage';
import CreateComplexityReasons from './createComplexityReasons/CreateComplexityReasons';

const Content: React.FC<Props> = ({ isSignUpOpen, handleSaveUser, handleCloseSignUp }): JSX.Element => {
    const userType = useSelector<StoreStateType, number>(state => state.user.data.userType);

    return (
        <>
            <Switch>
                {
                    (userType === UserTypeCodes.SUPER_ADMIN) &&
                    <Route path={createComplexityReasons} component={CreateComplexityReasons} />
                }
                <Route path={investigationFormRoute} component={InvestigationForm} />
                <Route path={landingPageRoute} component={LandingPage} />
                {
                    (userType === UserTypeCodes.INVESTIGATOR) &&
                    <Redirect from={adminLandingPageRoute} to={landingPageRoute} /> 
                }
                <Route path={adminLandingPageRoute} component={adminLandingPage} />
                {
                    (userType === UserTypeCodes.INVESTIGATOR) &&
                    <Redirect from={usersManagementRoute} to={landingPageRoute} /> 
                }
                <Route path={usersManagementRoute} component={UsersManagement} />
                {
                    (userType === UserTypeCodes.INVESTIGATOR) &&
                    <Redirect from={indexRoute} to={landingPageRoute} /> 
                }
                {
                    (userType === UserTypeCodes.ADMIN || userType === UserTypeCodes.SUPER_ADMIN) &&
                    <Redirect from={indexRoute} to={adminLandingPageRoute} />
                }
            </Switch>
            <SignUp open={isSignUpOpen} handleSaveUser={handleSaveUser} handleCloseSignUp={handleCloseSignUp} />
            <LoadingSpinner />
        </>
    )
}

interface Props {
    isSignUpOpen: boolean;
    handleSaveUser: () => void;
    handleCloseSignUp: () => void;
};

export default Content;
