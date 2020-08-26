import React from 'react';
import { Typography, Button } from '@material-ui/core';

import Validator from './Utils/Validations/Validator'

const App: React.FC = (): JSX.Element => {
    return (
        <div className='App'>
            <Typography>Coronal</Typography>
            <Button onClick={() => Validator.phoneValidation('056-79743393')}>CLICK ME!</Button>
        </div>
    );
}

export default App;
