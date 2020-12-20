import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';

import UserType from 'models/enums/UserType';
import StoreStateType from 'redux/storeStateType';
import LoadingSpinner from 'commons/LoadingSpinner/LoadingSpinner';
import { investigationFormRoute, landingPageRoute, usersManagementRoute, indexRoute, adminLandingPageRoute } from 'Utils/Routes/Routes';

import SignUp from './SignUp/SignUp';
import UsersManagement from './UsersManagement/UsersManagement';
import InvestigationForm from './InvestigationForm/InvestigationForm';
import LandingPage from './LandingPage/defaultLandingPage/LandingPage';
import adminLandingPage from './LandingPage/adminLandingPage/adminLandingPage';

const Content: React.FC<Props> = ({ isSignUpOpen, handleSaveUser, handleCloseSignUp }): JSX.Element => {
    const userType = useSelector<StoreStateType, number>(state => state.user.data.userType);

    return (
        <>
            <Switch>
                <Route path={investigationFormRoute} component={InvestigationForm} />
                <Route path={landingPageRoute} component={LandingPage} />
                <Route path={adminLandingPageRoute} component={adminLandingPage} />
                <Route path={usersManagementRoute} component={UsersManagement} />
                {
                    (userType === UserType.ADMIN || userType === UserType.SUPER_ADMIN) ?
                        <Redirect from={indexRoute} to={adminLandingPageRoute} /> :
                        <Redirect from={indexRoute} to={landingPageRoute} />
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
