import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    longAutoComplete: {
        width: 300
    },
    airportDetails: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    airportTextField: {
        marginLeft: '1vw',
        width: '15vw',
        marginRight: '1vw',
    }
});

export default useStyles;