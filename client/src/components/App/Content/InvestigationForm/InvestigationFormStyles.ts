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
    },
    finishInvestigationButton: {
        margin: '1vh 0',
        color: 'white',
        borderRadius: '10vw',
        height: '4vh',
        minWidth: '9vw',
    },
    swalTitle: {
        fontSize: '1.5vw',
        fontFamily: 'Assistant',
    }
});

export default useStyles;
