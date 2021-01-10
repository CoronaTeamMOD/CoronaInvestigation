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
    startCard: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    endCard: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    autocomplete: {
        width: '20vw'
    },
    autocompleteInput: {
        paddingRight: 'unset'
    },
    autocompleteInputText: {
        width: 'unset'
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
        padding: '0 0.4vw'
    },
    formControl: {
        padding: '0 0.4vw'
    },
    collapse: {
        maxWidth: '30%'
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
}));

export default useStyles;
