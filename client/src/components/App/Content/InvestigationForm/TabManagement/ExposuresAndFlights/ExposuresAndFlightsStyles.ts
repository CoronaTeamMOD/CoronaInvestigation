import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    subForm: {
        width: '75vw', padding: '3vh 3vw 3vh 0'
    },
    additionalInformationForm: {
        '@media screen and (min-width: 1220px)': {
            paddingRight: '19vw',
            flip: false
        },
    },
});

export default useStyles;
