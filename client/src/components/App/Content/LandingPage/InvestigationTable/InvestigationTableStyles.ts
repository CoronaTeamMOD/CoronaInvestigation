import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    content: {
        height: '84vh',
        backgroundColor: '#F3F6FB',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center'
    },
    tableContainer : {
        width: '90vw',
        height: '70vh',
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
    },
    columnBorder: {
        borderLeft: '2px solid black'
    },
    rowBorder: {
        borderBottom: '2px solid black'
    },
    swalTitle: {
        fontSize: '1.5vw',
        fontFamily: 'Assistant',
    },
    tableHeaderButton: {
        width: '90vw',
        display: 'flex',
        justifyContent: 'flex-end'
    },
    sortResetButton: {
        fontWeight: 600
    }
});

export default useStyles;
