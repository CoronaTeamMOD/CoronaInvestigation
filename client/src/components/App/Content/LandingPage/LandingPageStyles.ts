import { makeStyles } from '@material-ui/styles';

import {primaryBackgroundColor} from 'styles/theme';

const useStyles = makeStyles({
    content: {
        height: '84vh',
        backgroundColor: primaryBackgroundColor,
    },
    welcomeMessage: {
        fontSize: '4vh',
        display: 'flex',
        justifyContent: 'center'
    }
});

export default useStyles;
