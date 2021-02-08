import { makeStyles } from '@material-ui/styles';

import theme from 'styles/theme';

const useStyles = makeStyles({
    dialogPaper: {
        width: '95vw',
        height: '92vh',
    },
    dialogTitleWrapper: {
        backgroundColor: theme.palette.primary.dark,
        color: 'white',
        textAlign: 'left',
    },
    addEventButton: {
        color: 'white',
        borderRadius: '10vw',
        height: '4vh',
    },
    cancelButton: {
        borderRadius: '10vw',
        height: '4vh',
    },
    dialogFooter: {
        padding: '2vh 1vw',
        backgroundColor: 'lightgray',
        display: 'flex',
        justifyContent: 'space-between'
    },
    changeEventSubFormButton: {
        color: '#107F9B',
        fontWeight: 'bold'
    },
    footerActionButtons: {
        display: 'flex',
    }
});

export default useStyles;
