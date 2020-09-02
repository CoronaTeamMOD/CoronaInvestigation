import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    form: {
        display: 'flex',
        flexDirection: 'column'
    },
    fieldName: {
        fontWeight: 'bold'
    },
    rowDiv: {
        display: 'flex',
        margin: '1vh 0'
    },
    placeTypeSelect: {
        margin: '0 2vmin',
        width: '9vw'
    },
    toggle: {
        marginLeft: '1vw'
    }
});

export default useStyles;