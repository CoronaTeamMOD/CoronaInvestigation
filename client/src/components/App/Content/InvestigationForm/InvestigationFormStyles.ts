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
        margin: '1vh 0'
    },
    swalTitle: {
        fontSize: '1.5vw',
        fontFamily: 'Assistant',
    },
    swalText: {
        fontFamily: 'Assistant',
    },
    trackingForm: {
        padding : '1vh 1vw'
    },
    uncollapsed: {
        width: '25%',
        transition: '1s',
        padding: '0 8px',
        opacity: 1
    },
    collapsed: {
        width: '0',
        transition: '1s',
        opacity: 0
    },
    scriptWrapper: {
        maxHeight: '60vh',
        overflowY: 'scroll'
    },
    scriptWrapperWithMaxHeight: {
        maxHeight: '60vh',
        overflowY: 'scroll',
        padding: '15px'
    }
});

export default useStyles;
