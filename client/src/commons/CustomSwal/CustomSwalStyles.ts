import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    container: {
        zIndex: 10000
    },
    swalTitle: {
        fontSize: '1.5vw',
        fontFamily: 'Assistant',
        maxHeight: '30vh',
        overflowY: 'auto'
    },
    swalText: {
        fontFamily: 'Assistant',
    }
});

export default useStyles;