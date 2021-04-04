import { makeStyles } from '@material-ui/styles';

export const cardWidth = '20vw';
export const cardHeight = '35vh';

const useStyles = makeStyles({
    desksCard: {
        borderRadius: '1vw',
    },
    desksCardActions: {
        direction: 'ltr', 
        paddingLeft: '1vw',
        flip: false
    },
    desksWrapper: {
        minHeight: '150px',
        maxHeight: '20vh',
        overflowY: 'auto',
    }
});

export default useStyles;