import React from 'react';
import rtl from 'jss-rtl';
import { create } from 'jss';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { jssPreset } from '@material-ui/styles';
import { BrowserRouter } from 'react-router-dom';
import { MuiThemeProvider, StylesProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import heLocale from 'date-fns/locale/he';
import axios from 'axios';
import { PersistGate } from 'redux-persist/integration/react'

import './index.css';
import './styles/fonts.css';
import './styles/scrollbar.css';
import './assets/style.css';
import theme from './styles/theme';
import { store, persistor } from './redux/store';
import App from './components/App/App';

axios.defaults.baseURL = '/db';
axios.defaults.headers['content-type'] = 'text/plain';
axios.defaults.headers['Access-Control-Allow-Origin'] = '*';

axios.interceptors.request.use(
  async (config) => {
    config.headers.EpidemiologyNumber = store.getState().investigation.epidemiologyNumber;
    return config;
  },
  (error) => Promise.reject(error)
);

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={heLocale}>
        <StylesProvider jss={jss}>
          <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </PersistGate>
        </StylesProvider>
      </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
