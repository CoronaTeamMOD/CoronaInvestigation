import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    desksCard: {
        width: '15vw',
        height: '35vh',
        borderRadius: '1vw',
    },
    desksCardContent: {
        height: '68%',
    },
    cardTitle: {
        fontSize: '0.9vw',
    },
    desksCardActions: {
        direction: 'ltr', 
        paddingLeft: '1vw',
        flip: false
    }
});

export default useStyles;
