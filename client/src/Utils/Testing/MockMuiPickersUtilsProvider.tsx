import React from 'react'
import heLocale from 'date-fns/locale/he';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

const MockMuiPickersUtilsProvider : React.FC<Props> = (props) => {
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={heLocale}>
            {props.children}
        </MuiPickersUtilsProvider>
    )
}

interface Props {
    
}

export default MockMuiPickersUtilsProvider;
