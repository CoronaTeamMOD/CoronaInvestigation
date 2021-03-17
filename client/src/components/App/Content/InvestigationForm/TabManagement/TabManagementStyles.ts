import { makeStyles } from '@material-ui/styles';
import theme from 'styles/theme';

const useStyles = makeStyles({
    card: {
        maxHeight: '70vh',
    },
    displayedTab: {
        maxHeight: '70vh',
        overflowY: 'scroll'
    },
    errorIcon:{
        color: '#ffcc00'
    },
    icon:{
        marginTop: theme.spacing(1)
    }
});

export default useStyles;
