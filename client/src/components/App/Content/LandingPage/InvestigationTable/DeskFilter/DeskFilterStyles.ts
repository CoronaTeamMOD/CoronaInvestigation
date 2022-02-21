import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    card: {
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: '0.7vw'
    },
    chip: {
        maxWidth: '71%',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    },   
    autocomplete: {
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
}));

export default useStyles;
