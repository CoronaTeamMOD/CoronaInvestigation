import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    card: {
        alignItems: 'center',
        padding: theme.spacing(1),
        marginBottom: theme.spacing(1),
        borderRadius: 16,
        maxHeight: '80%',
        justifyContent: 'space-between'
    },
    mainLine: {
        display: 'flex',
        alignItems: 'center',
        maxHeight: '80%',
        justifyContent: 'space-between'
    },
    botLine: {
        display: 'flex',
        alignItems: 'center',
        borderRadius: 16,
        maxHeight: '80%'
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
    },
    row: {
        flexDirection: 'row',
    },
    autocomplete: {
        width: '13%',
        marginRight: '7px',
        '&.Mui-focused': {
            '& div[role="button"]': {
                overflow: 'hidden'
            }
        }
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
        maxWidth: '71%',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    },
    timeRangeError: {
        fontSize: '1vw',
    },
    column: {
        flexDirection: 'column'
    }
}));

export default useStyles;
