import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    card: {
        padding: theme.spacing(1),
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    autocomplete: {
        marginTop: theme.spacing(1),
        width: '80%',
        height: '60%',
        marginBottom: theme.spacing(1),
    },
    optionCheckbox: {
        height: '0.5vh',
        marginLeft: theme.spacing(1),
        flip: false,
    },
    textfield: {
        fontsize: '0.7vw'
    },
}));

export default useStyles;
