import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    toggle: {
        borderRadius: 48
    },
    isActiveToggle: {
        cursor: 'pointer',
        marginLeft: theme.spacing(2),
        flip: false
    }
}));

export default useStyles;
