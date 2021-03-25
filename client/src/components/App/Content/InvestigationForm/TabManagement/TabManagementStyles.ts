import { makeStyles } from '@material-ui/styles';
import theme from 'styles/theme';

const useStyles = makeStyles({
    card: {
        width: '100%',
        transition: '1s',
        maxHeight: '70vh'
    },
    collapsed: {
        width: '75%'
    },
    displayedTab: {
        maxHeight: '60vh',
        overflowY: 'scroll'
    },
    errorIcon:{
        color: '#ffcc00'
    },
    icon:{
        marginTop: theme.spacing(1)
    },
    nextButton: {
        marginLeft: 'auto',
        '& button': {
            maxHeight: '50px'
        }
    },
    tabs: {
        '& .Mui-selected' : {
            borderBottom: `3px solid ${theme.palette.primary.main}`,
            marginBottom: '-3px'
        }
    },
    indicator: {
        display: 'none'
    }
});

interface Props {
    collapsed: boolean;
}

export default useStyles;
