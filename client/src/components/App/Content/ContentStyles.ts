import { makeStyles } from '@material-ui/styles'

import theme from 'styles/theme';

const useStyles = makeStyles({
    content: {
        backgroundColor: 'lightGrey',
        padding: '0.7vw',
    },
    finishInvestigationButton: {
        marginTop: '1vh',
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        borderRadius: '10vw',
        height: '4vh',
    },
    buttonSection: {
        display: 'flex',
        justifyContent: 'flex-end',
    }
});

export default useStyles;
