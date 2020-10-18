import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles({
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    fieldName: {
        fontWeight: 'bold',
        marginRight: '1vw',
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
    formTypesSelect: {
        '@media screen and (max-width: 1400px)': {
            marginLeft: '-3vw',
        },
        marginLeft: '-4vw',
    },
    fieldContainer: {
        display: 'flex',
        alignItems: 'center',
        margin: '2vh',
        '@media screen and (min-width: 1870px)': {
            marginRight: '-3vw'
        },
        '@media screen and (max-width: 1000px)': {
            marginRight: '0.5vw',
        },
        marginRight: '-3vw',
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
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minWidth: '35vw',
    }
});

export default useStyles;