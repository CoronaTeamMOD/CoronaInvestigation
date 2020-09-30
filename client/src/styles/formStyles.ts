import {makeStyles} from '@material-ui/styles'

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
});

export default useStyles;