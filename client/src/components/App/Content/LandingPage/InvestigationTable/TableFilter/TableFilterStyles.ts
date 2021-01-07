import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    card: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(1),
        marginBottom: theme.spacing(1),
        borderRadius: 16,
        maxHeight: '80%'
    },
    autocomplete: {
        width: '33%',
    },
    optionCheckbox: {
        height: '0.5vh',
        marginLeft: theme.spacing(1),
        flip: false
    }, 
    title: {
        fontSize: '14px',
    },
    option: {
        fontSize: '1.2vw',
    },
    chip: {
        maxWidth: '50%',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    timeRangeError: {
        fontSize: '1vw',
    }
}));

export default useStyles;
