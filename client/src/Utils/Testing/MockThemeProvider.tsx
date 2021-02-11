import React from 'react'
import { MuiThemeProvider } from '@material-ui/core/styles';

import theme from 'styles/theme';

const MockFormProvider : React.FC<Props> = (props) => {
    return (
        <MuiThemeProvider theme={theme}>
            {props.children}
        </MuiThemeProvider>
    )
}

interface Props {
    
}

export default MockFormProvider;
