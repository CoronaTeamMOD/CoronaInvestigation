import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    timeRangeCard: {
        width: '15vw',
        height: '105%',
        borderRadius: '1vw',
    },
    cardTitle: {
        fontSize: '0.9vw',
    },
    timeRangeCardContent: {
        height: '52%',
    },
    timeCardActions: {
        direction: 'ltr', 
        paddingLeft: '1vw',
        flip: false
    }
});

export default useStyles;
