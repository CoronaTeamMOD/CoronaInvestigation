import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    airportDetails: {
        display: 'flex',
        flexDirection: 'row',
    },
    airportCountryTextField: {
        minWidth: '10vw',
    },
    countryAutocomplete: {
        width: '19vw',
    }
});

export default useStyles;
