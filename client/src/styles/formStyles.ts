import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    hidden: {
        display: 'none'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    fieldName: {
        fontWeight: 'bold',
        marginRight: '1vw',
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
    },
    additionalTextField: {
        '@media screen and (min-width: 1400px)': {
            marginLeft: '-3vw',
            paddingRight: '14vw',
        },
    },
    additionalMarginTextField: {
        marginLeft: '-1vw',
    },
    selectPlaceType: {
        width: '10vw',
        marginLeft: '2vw',
    },
    fieldContainer: {
        display: 'flex',
        alignItems: 'center',
        margin: '10px 15px 10px 0'
    },
    fontSize15: {
        fontSize: 16,
    },
    containerGrid: {
        maxWidth: '100vw',
    },
    formValue: {
        marginLeft: '-4vw',
        '@media screen and (max-width: 1700px)': {
            marginRight: '2vw',
        },
    },
    inputRow: {
        alignItems: 'center',
        minWidth: '45vw',
    },
    longTextInput: {
        width: '30vw'
    },
    formSize: {
        width: '100vw'
    }
});

export default useStyles;