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
    },
    desksWrapper: {
        overflowY: 'auto',
        height: '95%',
    }
});

export default useStyles;
