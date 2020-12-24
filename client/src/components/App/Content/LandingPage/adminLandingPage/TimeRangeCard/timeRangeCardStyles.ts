import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    timeRangeCard: {
        width: '15vw',
        height: '105%',
        borderRadius: '1vw',
    },
    cardTitle: {
        fontSize: '0.9vw',
    },
    TimeRangeCardContent: {
        height: '52%',
    },
    updateButton: {
        width: '4vw',
        color: 'white',
        backgroundColor: theme.palette.primary.dark
    }
}));

export default useStyles;
