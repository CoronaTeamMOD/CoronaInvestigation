import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    airportDetails: {
        display: 'flex',
        marginLeft: '-5.5vw',
        '@media screen and (max-width: 1280px)': {
            marginLeft: '-20.5vw'
        },
    },
    airportInput: {
        '@media screen and (min-width: 1450px)': {
            marginRight: '-6vw',
        },
        marginLeft: '4vw',
    },
});

export default useStyles;