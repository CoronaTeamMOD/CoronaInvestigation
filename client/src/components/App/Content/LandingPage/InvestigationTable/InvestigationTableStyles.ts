import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const tableWidth = '96vw';

const useStyles = (isWide: boolean) => makeStyles((theme: Theme) => ({
    content: {
        height: '80vh',
        backgroundColor: '#F3F6FB',
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        alignItems: 'center',
    },
    tableCell: {
        padding: '7px 0'
    },
    tableCellRoot: {
        padding: '0'
    },
    groupColor: {
        height: '4.2rem',
        width: '1rem'
    },
    title: {
        margin: 'auto',
        height: '14vh',
        width: tableWidth,
    },
    tableContainer: {
        width: tableWidth,
        height: isWide ? '67vh' : '61vh',
        marginBottom: '2vh'
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
        textDecoration: 'none'
    },
    clickableInvestigationRow: {
        cursor: 'pointer'
    },
    columnBorder: {
        borderLeft: '3px solid rgb(222, 218, 218)'
    },
    rowBorder: {
        borderBottom: '3px solid rgb(222, 218, 218)'
    },
    font: {
        color: '#424242',
        whiteSpace: 'nowrap',
        fontSize: '0.9rem'
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
        width: tableWidth,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        display: 'flex',
    },
    tableHeaderCell: {
        whiteSpace: 'nowrap',
        fontSize: '0.97rem'
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
    filterTableRow: {
        width: tableWidth,
        alignItems: 'center',
        justifyContent: 'flex-end',
        display: 'flex'
    },
    filterButton: {
        fontWeight: 600,
        minWidth: '3vw',
        justifyContent: 'flex-end',
        direction: 'ltr'
    },
    searchButton: {
        fontWeight: 600,
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
        alignItems: 'center',
        justifyContent: 'center'
    },
    warningIcon: {
        color: theme.palette.warning.main,
        paddingLeft: theme.spacing(1),
        flip: false
    },
    counterLabel: {
        fontWeight: 600
    },
    checkedRow: {
        backgroundColor: 'rgb(202, 222, 234)!important'
    },
    pagination: {
        marginTop: '0'
    },
    searchBar: {
        justifyContent: 'flex-end',
        width: '20vw',
        backgroundColor: 'white',
        borderRadius: '20px'
    },
    searchBarIcons: {
        marginRight: '-1vw'
    },
    horizontalSticky: {
        left: 'unset'
    },
    padCheckboxWithoutGroup: {
        marginRight: theme.spacing(6.5)
    },
    popover: {
        width: 250,
        padding: theme.spacing(1)
    }
}));

export default useStyles;
