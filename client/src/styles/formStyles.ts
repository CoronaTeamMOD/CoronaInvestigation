  
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
    formRow: {
        display: 'flex',
        margin: '1vh 0',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    roundedTextLabel: {
        lineHeight: 0,
    },
    formToggle: {
        marginLeft: '1vw'
    },
    autocomplete: {
        width: '20vw'
    }
});

export default useStyles;