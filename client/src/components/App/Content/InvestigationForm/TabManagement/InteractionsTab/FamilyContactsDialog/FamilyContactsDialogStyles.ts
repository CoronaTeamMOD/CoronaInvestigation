import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    paper: {
        width: '77vw',
        height: '92vh',
    },
    title: {
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
    },
    warningIcon: {
        color: theme.palette.warning.main,
        fontSize: '15vh',
    },
    content: {
        height: '40vh',
        overflowY: 'auto',    
        marginLeft: '1vw',
        direction: 'rtl',
    },
    table: {
        direction: 'ltr',
    },
    footer: {
        display: 'flex',
        justifyContent: 'center',
        margin: '1vh 0',
    },
    cancelButton: {
        color: 'white',
        backgroundColor: theme.palette.error.main,
    },
    confirmButton: {
        color: 'white',
        backgroundColor: theme.palette.primary.main,
    }
}));

export default useStyles;
