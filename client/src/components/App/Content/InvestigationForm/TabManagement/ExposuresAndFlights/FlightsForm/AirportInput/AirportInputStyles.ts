import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    airportDetails: {
        display: 'flex',
        flexDirection: 'row',
    },
    airportCountryTextField: {
        width: '10vw',
        '@media screen and (min-width: 1450px)': {
            marginRight: '-6vw',
        },
    },
    additionalAirportDetails: {
        '@media screen and (min-width: 1800px)': {
            marginRight: '7vw',
        },
    },
    airportTextField: {
        marginLeft: '1vw',
    }
});

export default useStyles;