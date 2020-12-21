import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    desksCard: {
        width: '15vw',
        height: '30vh',
        borderRadius: '1vw',
    },
    desksCardContent: {
        height: '72%',
    },
    cardTitle: {
        fontSize: '0.9vw',
    },
    updateButton: {
        width: '4vw',
        color: 'white',
        backgroundColor: theme.palette.primary.dark
    }
}));

export default useStyles;
