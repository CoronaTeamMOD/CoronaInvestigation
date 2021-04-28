import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    text: {
        color: theme.palette.error.main,
        display: 'inline',
        fontSize: '16px'
    }
}));

export default useStyles;
