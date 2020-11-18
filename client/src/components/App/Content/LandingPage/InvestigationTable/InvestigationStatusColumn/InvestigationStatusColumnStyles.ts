import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    columnWrapper: {
        display: 'flex',
        alignItems: 'center'
    },
    investigatonIcon: {
        marginLeft: theme.spacing(0.75),
        cursor: 'pointer',
        flip: false
    },
}));

export default useStyles;
