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
    },
    inputRow: {
        alignItems: 'center',
        minWidth: '45vw',
        '&.MuiGrid-item': {
            paddingLeft: 0
        }
    },
});

export default useStyles;
