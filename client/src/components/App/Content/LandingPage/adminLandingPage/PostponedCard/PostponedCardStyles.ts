import { makeStyles } from '@material-ui/styles';

export const cardHeight = '8vh';

const useStyles = makeStyles({
    postponedCard: {
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
    },
    pauseIcon: {
        color: '#FDA815'
    }
});

export default useStyles;
