import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
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
    },
    activeSortIcon: {
        '&$active': {
            '&& $icon': {
              color: theme.palette.primary.dark,
              fontSize: "x-large"
            }
        }
    },
    icon: {},
    active: {},
    priorityCell: {
        display: 'flex',
        alignItems: 'center'
    },
    priorityTableCell: {
        paddingLeft: '0'
    },
    testDateCell: {
        width: '6vw'
    }, 
    epiNumberCell: {
        width: '7vw'
    },
    userSelectOption: {
        borderBottom: '2px solid rgba(224, 224, 224, 1)'
    },
    popperStyle: {
        width: 350
    }
}));

export default useStyles;