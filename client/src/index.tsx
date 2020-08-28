import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import {BrowserRouter} from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks';

import './index.css';
import App from './components/App/App';
import './styles/fonts.css';
import theme from './styles/theme';

const client = new ApolloClient({
    uri: '/graphql'
});

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <ApolloProvider client={client}>
            <ApolloHooksProvider client={client}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ApolloHooksProvider>
        </ApolloProvider>
    </MuiThemeProvider>
,    document.getElementById('root') as HTMLElement
);