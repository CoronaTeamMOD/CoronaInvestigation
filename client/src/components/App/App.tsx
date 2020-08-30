import React from 'react';

import AppToolbar from './AppToolbar/AppToolbar';
import Content from './Content/Content';

const App: React.FC = (): JSX.Element => {
    return (
        <>
            <AppToolbar/>
            <Content/>
        </>
    );
}

export default App;
