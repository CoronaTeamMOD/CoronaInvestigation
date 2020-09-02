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
    formRow: {
        display: 'flex',
        margin: '1vh 0',
    },
    formField: {
        display: 'flex',
        alignItems: 'center'
    }
});

export default useStyles;