import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    card: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(1),
        marginBottom: theme.spacing(1),
        borderRadius: 16,
        maxHeight: '80%',
        justifyContent: 'space-between'
    },
    sortResetButton: {
        fontWeight: 600,
        minWidth: '6px',
        marginLeft: '8px',
    },
    counterLabel: {
        fontWeight: 600
    },
    tableHeaderRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        display: 'flex',
    },
    startCard: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    endCard: {
        display: 'flex',
        flexDirection: 'column',
    },
    row: {
        flexDirection: 'row',
    },
    autocomplete: {
        width: '12vw'
    },
    autocompleteInput: {
        paddingRight: 'unset'
    },
    autocompleteInputText: {
        width: 'unset'
    },
    checkbox: {
        padding: '2px'
    },
    optionCheckbox: {
        height: '0.5vh',
        marginLeft: theme.spacing(1),
        flip: false
    },
    headTitle: {
        fontSize: '1.2vw',
        paddingRight: '1vw'
    },
    title: {
        fontSize: '1vw',
        padding: '0 0.4vw',
        display: 'inline'
    },
    formControl: {
        padding: '0 0.4vw'
    },
    formControlCustomTimeRange: {
        padding: '0 0.4vw',
        margin: '43px 0 10px 0'
    },
    option: {
        fontSize: '1vw',
    },
    chip: {
        maxWidth: '50%',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    timeRangeError: {
        fontSize: '1vw',
    },
    column: {
        flexDirection: 'column'
    }
}));

export default useStyles;
