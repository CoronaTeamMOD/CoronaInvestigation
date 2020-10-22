import { makeStyles } from '@material-ui/styles';
import { primaryBackgroundColor } from 'styles/theme';

const useStyles = makeStyles(() => ({
    content: {
        height: '84vh',
        backgroundColor: primaryBackgroundColor,
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center'
    },
    tableContainer : {
        width: '90vw',
        height: '70vh',
    },
    autoComplete: {
        width: '10vw'
    },
    pagination: {
        marginTop: '3vh'
    }
}));

export default useStyles;