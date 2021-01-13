import { makeStyles } from '@material-ui/styles';

export const cardWidth = '20vw';
export const cardHeight = '35vh';

const useStyles = makeStyles({
    desksCard: {
        height: '35vh',
        borderRadius: '1vw',
    },
    desksCardContent: {
        height: '30vh',
    },
    desksCardActions: {
        direction: 'ltr', 
        paddingLeft: '1vw',
        flip: false
    },
    desksWrapper: {
        overflowY: 'auto',
    }
});

export default useStyles;