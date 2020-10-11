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

import './index.css';
import './styles/fonts.css';
import theme from './styles/theme';
import { store } from './redux/store';
import App from './components/App/App';

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={heLocale}>
        <StylesProvider jss={jss}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </StylesProvider>
      </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
