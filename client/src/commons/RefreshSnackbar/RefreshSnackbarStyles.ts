import {makeStyles} from '@material-ui/styles';
import {Theme} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
    button: {
        background: 'white',
        color: theme.palette.primary.main,
        width: '6vw',
        height: '4vh',
        borderRadius: '20px',
        fontWeight: 700,
    },
}));

export default useStyles;
