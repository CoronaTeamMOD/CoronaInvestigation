import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    fieldName: {
        fontWeight: 'bold'
    },
    rowDiv: {
        display: 'flex',
        margin: '1vh 0',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    roundedTextField: {
        borderRadius: 25,
        maxHeight: '5vh',
        margin: '0 2%',
        width: '12vw',
    },
    roundedTextLabel: {
        lineHeight: 0,
    }
});

export default useStyles;