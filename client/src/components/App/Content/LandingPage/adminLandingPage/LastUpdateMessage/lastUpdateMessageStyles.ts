import { makeStyles } from '@material-ui/styles';
import theme from 'styles/theme';

const useStyles = makeStyles({
    refreshIcon: {
        color: theme.palette.primary.main,
        cursor: 'pointer'
    },
});

export default useStyles;