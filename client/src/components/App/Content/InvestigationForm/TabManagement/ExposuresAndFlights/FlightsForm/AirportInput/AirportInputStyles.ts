import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    airportDetails: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: '-5.5vw',
        '@media screen and (max-width: 1280px)': {
            marginLeft: '-20.5vw'
        },
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