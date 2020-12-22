import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    airportDetails: {
        display: 'flex',
        flexDirection: 'row',
    },
    airportCountryTextField: {
        width: '10vw',
    },
    airportTextField: {
        marginLeft: '1vw',
    },
    countryAutocomplete: {
        width: '19vw',
    }
});

export default useStyles;
