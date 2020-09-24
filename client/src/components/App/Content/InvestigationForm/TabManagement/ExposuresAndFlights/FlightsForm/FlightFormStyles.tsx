
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    flightDetails: {
        maxWidth: '50%',
        '@media screen and (max-width: 1280px)': {
            maxWidth: '70%',
        },
    },
    flightDates: {
        display: 'flex',
        '@media screen and (max-width: 1280px)': {
            marginLeft: '-25vw',
        },
        marginLeft: '-17vw',
    },
    additionalFlightDetails: {
        marginLeft: '-5.5vw'
    },
});

export default useStyles;