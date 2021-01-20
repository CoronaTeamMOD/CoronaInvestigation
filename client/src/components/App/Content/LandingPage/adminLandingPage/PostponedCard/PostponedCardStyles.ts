import { makeStyles } from '@material-ui/styles';

export const cardWidth = '14vw';
export const cardHeight = '16vh';

const useStyles = makeStyles({
    postponedCard: {
        width: cardWidth,
        borderRadius: '1vw',
        padding: '1vh 1vw',
    },
    investigationAmount: {
        fontSize: '1.2vw',
        display: 'flex',
    },
    investigationNumberText: {
        color: '#F95959',
        marginRight: '0.8vw',
        marginTop: '0.5vw',
    },
    navigateIcon: {
        backgroundColor: 'WhiteSmoke',
        borderRadius: '2vw',
        marginTop: '0.5vw',
    },
    pauseIcon: {
        marginRight: '0.5vw',
        color: '#FDA815',
    },
    investigationText: {
        margin: '0.5vw',
        flex: 'auto' 
    },
    filterText: {
        margin: '0.5vw'
    }
});

export default useStyles;
