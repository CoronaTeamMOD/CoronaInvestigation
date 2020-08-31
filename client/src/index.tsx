import React from 'react';
import ReactDOM from 'react-dom';
import rtl from 'jss-rtl';
import {create} from 'jss';
import {Provider} from 'react-redux';
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from 'react-apollo';
import {jssPreset} from '@material-ui/styles';
import {BrowserRouter} from 'react-router-dom';
import {MuiThemeProvider, StylesProvider} from '@material-ui/core/styles';
import {ApolloProvider as ApolloHooksProvider} from '@apollo/react-hooks';

import './index.css';
import './styles/fonts.css';
import theme from './styles/theme';
import {store} from './redux/store';
import App from './components/App/App';

const client = new ApolloClient({
    uri: '/graphql'
});

const jss = create({plugins: [...jssPreset().plugins, rtl()]});

ReactDOM.render(
    <Provider store={store}>  
        <MuiThemeProvider theme={theme}>
            <ApolloProvider client={client}>
                <ApolloHooksProvider client={client}>
                    <StylesProvider jss={jss}>
                        <BrowserRouter>
                            <App/>
                        </BrowserRouter>
                    </StylesProvider>
                </ApolloHooksProvider>
            </ApolloProvider>
        </MuiThemeProvider>
    </Provider>
    , document.getElementById('root') as HTMLElement
);