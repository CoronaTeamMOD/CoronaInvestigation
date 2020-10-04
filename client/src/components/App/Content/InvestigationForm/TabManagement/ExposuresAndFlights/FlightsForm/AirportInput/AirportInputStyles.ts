import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    airportDetails: {
        display: 'flex',
        flexDirection: 'row',
        marginLeft: '-5.5vw',
        '@media screen and (max-width: 1280px)': {
            marginLeft: '-20.5vw'
        },
    },
    airportTextField: {
        marginLeft: '1vw',
    }
});

export default useStyles;