import React from 'react';

import AppToolbar from './AppToolbar/AppToolbar';
import Content from './Content/Content';

const App: React.FC = (): JSX.Element => {
    return (
        <div>
            <AppToolbar></AppToolbar>
            <Content></Content>
        </div>
    );
}

export default App;
