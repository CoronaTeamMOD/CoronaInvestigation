import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    card: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    autocomplete: {
        width: '60%'
    },
    optionCheckbox: {
        marginLeft: theme.spacing(1),
        flip: false
    }
}));

export default useStyles;
