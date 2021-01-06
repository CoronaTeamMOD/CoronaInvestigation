import { makeStyles } from '@material-ui/styles';

export const cardWidth = '20vw';
export const cardHeight = '35vh';

const useStyles = makeStyles({
    desksCard: {
        width: '20vw',
        height: '35vh',
        borderRadius: '1vw',
    },
    desksCardContent: {
        height: '70%',
        width: '13.6vw',
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