import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    card: {
        padding: theme.spacing(1.5),
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    autocomplete: {
        width: '100%',
    },
    optionCheckbox: {
        marginLeft: theme.spacing(1),
        flip: false
    }
}));

export default useStyles;
