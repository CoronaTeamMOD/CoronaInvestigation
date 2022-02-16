import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const tableWidth = '96vw';

export const useTooltipStyles = makeStyles(({
    content: {
        display: 'flex',
        flexDirection: 'column',
        transform: 'translate(-200%, -75%) !important',
        flip: false,

        '&::before': {
            content:'""',
            width: '0px',
            height: '0px',
            position: 'absolute',
            borderLeft: '10px solid rgba(97, 97, 97, 0.9)',
            borderRight: '10px solid transparent',
            borderTop: '10px solid rgba(97, 97, 97, 0.9)',
            borderBottom: '10px solid transparent',
            bottom: '-20px',
            right: '20px'
        }
    },
}));

const useStyles = (isWide: boolean) => makeStyles((theme: Theme) => ({
    content: {
        backgroundColor: '#F3F6FB',
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        alignItems: 'center',
    },
    tableCell: {
        padding: '7px 0',
        textAlign:'start',
        paddingLeft: '2vh'
    },
    title: {
        margin: 'auto',
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        width: tableWidth,
        justifyContent: 'space-between'
    },
    tableContainer: {
        width: tableWidth,
        height: isWide ? '67vh' : '61vh',
        marginBottom: '2vh'
    },
    errorAlertTitle: {
        fontFamily: 'Assistant'
    },
    columnBorder: {
        borderLeft: '3px solid rgb(222, 218, 218)',
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
        fontSize: '0.9rem'
    },
    watchBtn: {
        whiteSpace: 'nowrap',
        maxWidth: '200px'
    },
    biggerWidth:{
        maxWidth: '120px',
        paddingLeft: '0vw'
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
        fontSize: '0.97rem',
        textAlign: 'start',
        paddingLeft: '2vh'
    },
    deskFilterCard: {
        marginRight : 'auto'
    },
    filterTableRow: {
        width: tableWidth,
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
                fontSize: 'x-large'
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
    pagination: {
        marginTop: '0'
    },
    searchBar: {
        justifyContent: 'flex-end',
        width: '350px',
        backgroundColor: 'white',
        borderRadius: '20px',
    },
    searchBarIcons: {
        marginRight: '-1vw'
    },
    horizontalSticky: {
        left: 'unset'
    },
    popover: {
        width: 250,
        padding: theme.spacing(1)
    },
    sortResetButton: {
        fontWeight: 600,
        minWidth: '6px',
        marginLeft: '8px',
        paddingRight: '0',
    },
    commentCell: {
        whiteSpace: 'nowrap',
        maxWidth: '17vw'
    },
}))();

export default useStyles;
