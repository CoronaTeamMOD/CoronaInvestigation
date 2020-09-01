import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    form: {
        display: 'flex',
        flexDirection: 'column',
        paddingRight: '7vh',
        flip: false,
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
        borderRadius: 15,
        // width: '15vw',
        // minHeight: '4vh',
        maxHeight: '5vh',
    },
    roundedTextLabel: {
        lineHeight: 0
    }
});

export default useStyles;