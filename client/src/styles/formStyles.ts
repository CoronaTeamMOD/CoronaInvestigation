  
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    fieldName: {
        fontWeight: 'bold',
        marginRight: '1vw'
    },
    formField: {
        display: 'flex',
        alignItems: 'center'
    },
    rowDiv: {
        display: 'flex',
        margin: '1vh 0',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    formRow: {
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
    },
    formSelect: {
        width: '9vw'
    },
    formToggle: {
        marginLeft: '1vw'
    },
});

export default useStyles;