  
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
    formSelect: {
        width: '9vw'
    },
    formToggle: {
        marginLeft: '1vw'
    },
});

export default useStyles;