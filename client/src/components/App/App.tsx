import React from 'react';
import { config } from 'dotenv';

import useApp from './useApp';
import Content from './Content/Content';
import AppToolbar from './AppToolbar/AppToolbar';

config();

const App: React.FC = (): JSX.Element => {

    const { handleCloseSignUp, handleSaveUser, isSignUpOpen } = useApp()

    return (
        <>
            <AppToolbar />
            <Content isSignUpOpen={isSignUpOpen} handleSaveUser={handleSaveUser} handleCloseSignUp={handleCloseSignUp} />
        </>
    );
}

export default App;