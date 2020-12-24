import { makeStyles } from '@material-ui/styles';
import theme from 'styles/theme';

const useStyles = makeStyles({
    card: {
        height: '70vh',
    },
    displayedTab: {
        height: '90%',
        overflow: 'auto'
    },
    errorIcon:{
        color: '#ffcc00'
    },
    icon:{
        marginTop: theme.spacing(1)
    }
});

export default useStyles;
