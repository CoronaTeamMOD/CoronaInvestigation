import { makeStyles } from '@material-ui/styles'

import theme from 'styles/theme';

const useStyles = makeStyles({
    content: {
        height: '100vh',
        backgroundColor: '#F3F6FB',
    },
    interactiveForm: {
        padding: '2vh 1vw 1vh 1vw',
    },
    buttonSection: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    finishInvestigationButton: {
        marginTop: '1vh',
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        borderRadius: '10vw',
        height: '4vh',
    },
    swalTitle: {
        fontSize: '1.5vw',
        fontFamily: 'Assistant',
    }
});

export default useStyles;
