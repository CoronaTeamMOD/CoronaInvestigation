import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    content: {
        height: '80vh',
        backgroundColor: '#F3F6FB',
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        alignItems: 'center',
    },
    title: {
        margin: 'auto',
        height: '14vh',
        width: '90vw',
    },
    tableContainer : {
        width: '90vw',
        marginBottom: '5vh'
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
    font: {
        color:'#424242'
    },
    swalTitle: {
        fontSize: '1.5vw',
        fontFamily: 'Assistant',
    },
    filterByDeskCard: {
        padding: '1vh 1vw',
        width: '13vw',
        borderRadius: 15,
        left: 0
    },
    deskFilterTitle: {
        fontSize: '1.2vw',
    },
    tableHeaderRow: {
        width: '90vw',  
    },
    sortResetButton: {
        fontWeight: 600
    },
    filterTableCard: {
        width: '30vw',
        display: 'flex',
        justifyContent: 'space-evenly',
        margin: '1vh 0',
        alignItems: 'center',
        height: '8vh',
    },
    filterButton: {
        fontWeight: 600,
        minWidth: '3vw',
        justifyContent: 'flex-end',
        direction: 'ltr'
    },
    autocompleteInput: {
        paddingRight: 'unset' + '!important',
        padding: '1vh 0', 
        width: '12vw',
        fontSize: '1vw'
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
    testDateCell: {
        width: '6vw'
    }, 
    epiNumberCell: {
        width: '7vw'
    },
    userSelectOption: {
        borderBottom: '2px solid rgba(224, 224, 224, 1)'
    },
    fullWidthDiv: {
         width: '-webkit-fill-available'
    },
    userNameStyle: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    priorityCell: {
        display: 'flex',
        alignItems: 'center'
    },
    priorityWithoutComplex: {
        marginLeft: '2vw'
    },
    priorityWithoutComplexSmall: {
        marginLeft: '2.3vw'
    },
    priorityWithComplex: {
        marginLeft: '0.6vw'
    },
    priorityTableCell: {
        paddingLeft: '0'
    },
    selectedInvestigator: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    warningIcon: {
        color: theme.palette.warning.main,
        paddingLeft: theme.spacing(1),
        flip: false
    }
}));

export default useStyles;