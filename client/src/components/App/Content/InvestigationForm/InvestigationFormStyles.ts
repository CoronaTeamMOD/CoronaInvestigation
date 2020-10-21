import { makeStyles } from '@material-ui/styles';
import {primaryBackgroundColor} from 'styles/theme';

const useStyles = makeStyles({
    content: {
        height: '92vh',
        backgroundColor: primaryBackgroundColor,
    },
    interactiveForm: {
        padding: '2vh 1vw 0 1vw',
    },
    buttonSection: {
        display: 'flex',
        justifyContent: 'flex-end',
        margin: '1vh 0'
    },
    swalTitle: {
        fontSize: '1.5vw',
        fontFamily: 'Assistant',
    },
    swalText: {
        fontFamily: 'Assistant',
    }
});

export default useStyles;
