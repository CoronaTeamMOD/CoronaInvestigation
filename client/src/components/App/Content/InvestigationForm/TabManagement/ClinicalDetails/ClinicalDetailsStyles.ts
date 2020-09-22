import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles({
    form: {
        padding: '2vh',
    },
    dates: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: '2vh',
    },
    smallGrid: {
        width: '40vw'
    },
    floorHouseNumTextField: {
        marginLeft: '1vw',
        width: '9vw'
    },
    cityStreetTextField: {
        marginLeft: '1vw',
        width: '20vw'  
    },
    isolationProblemTextField: {
        marginLeft: '1vw',
        width: '15vw'
    },
    otherTextField: {
        marginTop: '1vh',
        marginLeft: '-15vw',
    }
});
