import { makeStyles } from '@material-ui/styles';

export const cardWidth = '15vw';
export const cardHeight = '35vh';

const useStyles = makeStyles({
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