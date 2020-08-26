import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks';

import './index.css';
import App from './App';
import './styles/fonts.css';
import theme from './styles/theme';

const client = new ApolloClient({
    uri: '/graphql'
});

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <ApolloProvider client={client}>
            <ApolloHooksProvider client={client}>
                <App />
            </ApolloHooksProvider>
        </ApolloProvider>
    </MuiThemeProvider>
,    document.getElementById('root') as HTMLElement
);
