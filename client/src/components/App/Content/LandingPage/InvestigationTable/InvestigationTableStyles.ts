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
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
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
    openedTableCell: {
        borderTop: '3px solid rgb(222, 218, 218)'
    },
    nestedTableCell: {
        borderBottom: 'none'
    },
    font: {
        color: '#424242',
        whiteSpace: 'nowrap',
        fontSize: '0.9rem'
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
    filterTableRow: {
        width: tableWidth,
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
}))();

export default useStyles;
