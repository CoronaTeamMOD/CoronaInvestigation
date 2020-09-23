import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    subForm: {
        width: '93vw',
        padding: '3vh 1.5vw 3vw 3vh'
    },
    additionalInformationForm: {
        '@media screen and (min-width: 1220px)': {
            flip: false
        },
    },
    contactToggle: {
        '@media screen and (max-width: 1900px) and (min-width: 1280px)': {
            marginLeft: '-9vw',
        },
        marginLeft: '-13vw',
    },
    abroadToggle: {
      marginLeft: '-13vw',
    }
});

export default useStyles;
