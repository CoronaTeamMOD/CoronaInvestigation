import React from 'react';

import Content from './Content/Content';
import AppToolbar from './AppToolbar/AppToolbar';
import NewConactEvent from './Content/InvestigationForm/NewContactEvent/NewContactEvent';

const App: React.FC = (): JSX.Element => {
    return (
        <>
            <AppToolbar/>
            <Content/>
            <NewConactEvent isOpen={true} />
        </>
    );
}

export default App;
