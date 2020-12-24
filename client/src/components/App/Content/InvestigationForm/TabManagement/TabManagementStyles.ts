import { makeStyles } from '@material-ui/styles';

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
        marginTop: '0.8vh'
    }
});

export default useStyles;
