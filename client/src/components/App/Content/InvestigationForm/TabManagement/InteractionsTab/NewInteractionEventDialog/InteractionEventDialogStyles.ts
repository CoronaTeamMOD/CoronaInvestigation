import { makeStyles } from '@material-ui/styles'

import theme from 'styles/theme';

const useStyles = makeStyles({
    dialogPaper: {
        width: '50vw',
        height: '70vh',
    },
    dialogTitle: {
        backgroundColor: theme.palette.primary.dark,
        color: 'white',
        textAlign: 'left',
        '& h6': {
            fontWeight: 'lighter'
        }
    },
    fieldName: {
        fontWeight: 'bold'
    },
    dialogContent: {
        display: 'flex',
        flexDirection: 'column'
    },
    rowDiv: {
        display: 'flex',
        flexDirection: 'row',
        margin: '1vmin 0'
    },
    placeSelect: {
        margin: '0 2vmin',
        width: '9vw'
    },
    addEventButton: {
        color: 'white',
        borderRadius: '10vw',
        height: '4vh',
    },
    cancleButton: {
        borderRadius: '10vw',
        height: '4vh',
    },
    dialogFooter: {
        padding: '2vh 1vw',
        backgroundColor: 'lightgray',
    }
});

export default useStyles;