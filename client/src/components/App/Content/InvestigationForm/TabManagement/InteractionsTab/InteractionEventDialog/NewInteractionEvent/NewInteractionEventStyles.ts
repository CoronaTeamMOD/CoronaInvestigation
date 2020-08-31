import { makeStyles } from '@material-ui/styles'

import theme from 'styles/theme';

const useStyles = makeStyles({
    dialogRoot: {
        height: '70vh',
        width: '85vw'
    },
    dialogTitle: {
        backgroundColor: theme.palette.primary.dark,
        color: 'white',
        textAlign: 'left',
        width: '75vw'
    },
    place: {
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
    }
});

export default useStyles;