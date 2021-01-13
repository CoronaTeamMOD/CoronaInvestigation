import { makeStyles } from '@material-ui/styles';

export const cardHeight = '8vh';

const useStyles = makeStyles({
    unallocatedCard: {
        height: cardHeight,
        borderRadius: '1vw',
        padding: '1vh 1vw',
        cursor: 'pointer',
    },
    investigationAmount: {
        fontSize: '1.2vw',
        display: 'flex',
    },
    investigationNumberText: {
        color: '#F95959',
        marginRight: '0.8vw',
    },
    investigationAmountText: {
    },
    navigateIcon: {
        backgroundColor: 'WhiteSmoke',
        borderRadius: '2vw',
    }
});

export default useStyles;
