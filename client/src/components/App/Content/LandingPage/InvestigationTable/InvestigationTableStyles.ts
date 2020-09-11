import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    content: {
        height: '84vh',
        backgroundColor: '#F3F6FB',
        padding: '1vh 1vw 0 1vw',
        display: 'flex',
        justifyContent: 'center',
    },
    tableContainer : {
        width: '70vw',
        height: '75vh',
    },
    welcomeMessage: {
        fontSize: '4vh',
        display: 'flex',
        justifyContent: 'center'
    },
    errorAlertTitle: {
        fontFamily: 'Assistant'
    },
    investigationRow: {
        textDecoration: 'none',
        cursor: 'pointer'
    }
});

export default useStyles;
